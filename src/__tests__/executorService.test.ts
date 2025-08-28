import { ExecutorService } from '../services/executer/index.js';
import { getSignerInfo, getValidatotConfig } from '../services/utils.js';
import { createDelegatedAccount } from '../services/executer/utils/account.js';
import { buildTransferAsset } from '../services/executer/utils/token.js';
import { sendTransaction } from '../services/executer/utils/transactions.js';
import { SmartAccount } from 'viem/account-abstraction';
import { Address, Hex } from 'viem';

// Mock all the imported modules
jest.mock('../services/utils.js');
jest.mock('../services/executer/utils/account.js');
jest.mock('../services/executer/utils/token.js');
jest.mock('../services/executer/utils/transactions.js');

describe('ExecutorService', () => {
  let executorService: ExecutorService;
  const mockSigner = {
    address: '0x1234567890123456789012345678901234567890' as Address
  };
  const mockValidatorConfig = {
    validator: 'ownable',
    validatorInitData: '0x',
    salt: '0x123' as Hex
  };
  const mockDelegatedAccount = {
    address: '0x9876543210987654321098765432109876543210'
  } as SmartAccount;

  beforeEach(() => {
    executorService = new ExecutorService();
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup mock implementations
    (getSignerInfo as jest.Mock).mockReturnValue({ signer: mockSigner });
    (getValidatotConfig as jest.Mock).mockReturnValue(mockValidatorConfig);
    (createDelegatedAccount as jest.Mock).mockResolvedValue(mockDelegatedAccount);
    (buildTransferAsset as jest.Mock).mockImplementation(( token) => ({
      to: token,
      data: '0x',
      value: BigInt(0)
    }));
    (sendTransaction as jest.Mock).mockResolvedValue({
      hash: '0x123456789',
      wait: jest.fn().mockResolvedValue({})
    });
  });

  describe('executeSend', () => {
    const mockTransfers = [
      {
        to: '0xabc1' as Address,
        token: '0xdef1' as Address,
        amount: '100'
      },
      {
        to: '0xabc2' as Address,
        token: '0xdef2' as Address,
        amount: '200'
      }
    ];
    const mockValidatorSalt = '0x123' as Hex;
    const mockAccountAddress = '0x456' as Address;

    it('should execute multiple transfers successfully', async () => {
      const result = await executorService.executeSend({
        transfers: mockTransfers,
        validatorSalt: mockValidatorSalt,
        accountAddress: mockAccountAddress
      });

      // Verify signer info was retrieved
      expect(getSignerInfo).toHaveBeenCalled();

      // Verify validator config was created
      expect(getValidatotConfig).toHaveBeenCalledWith(
        mockSigner.address,
        mockValidatorSalt
      );

      // Verify delegated account was created
      expect(createDelegatedAccount).toHaveBeenCalledWith(
        mockSigner,
        mockValidatorConfig,
        8453,
        mockAccountAddress
      );

      // Verify transfer assets were built for each transfer
      expect(buildTransferAsset).toHaveBeenCalledTimes(2);
      mockTransfers.forEach((transfer, index) => {
        expect(buildTransferAsset).toHaveBeenNthCalledWith(
          index + 1,
          8453,
          transfer.token,
          transfer.to,
          transfer.amount
        );
      });

      // Verify transaction was sent
      expect(sendTransaction).toHaveBeenCalledWith(
        expect.any(Array),
        mockDelegatedAccount,
        8453
      );

      // Verify the result
      expect(result).toEqual({
        hash: '0x123456789',
        wait: expect.any(Function)
      });
    });

    it('should throw error when signer address is missing', async () => {
      (getSignerInfo as jest.Mock).mockReturnValue({ signer: { address: null } });

      await expect(executorService.executeSend({
        transfers: mockTransfers,
        validatorSalt: mockValidatorSalt,
        accountAddress: mockAccountAddress
      })).rejects.toThrow('Signer address is required');
    });

    it('should handle transaction failure', async () => {
      (sendTransaction as jest.Mock).mockRejectedValue(new Error('Transaction failed'));

      await expect(executorService.executeSend({
        transfers: mockTransfers,
        validatorSalt: mockValidatorSalt,
        accountAddress: mockAccountAddress
      })).rejects.toThrow('Transaction failed');
    });

    it('should handle empty transfers array', async () => {
      await expect(executorService.executeSend({
        transfers: [],
        validatorSalt: mockValidatorSalt,
        accountAddress: mockAccountAddress
      })).resolves.toBeDefined();

      expect(buildTransferAsset).not.toHaveBeenCalled();
    });

    it('should use correct chain ID for all operations', async () => {
      await executorService.executeSend({
        transfers: mockTransfers,
        validatorSalt: mockValidatorSalt,
        accountAddress: mockAccountAddress
      });

      // Verify chain ID (8453 - Base) is used consistently
      expect(createDelegatedAccount).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        8453,
        expect.anything()
      );

      mockTransfers.forEach(() => {
        expect(buildTransferAsset).toHaveBeenCalledWith(
          8453,
          expect.anything(),
          expect.anything(),
          expect.anything()
        );
      });

      expect(sendTransaction).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        8453
      );
    });
  });
});
