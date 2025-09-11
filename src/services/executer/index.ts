import { createDelegatedAccount } from './utils/account.js';
// import { logger } from './utils/logger';
import { sendTransaction } from './utils/transactions.js';
import { buildTransferAsset } from './utils/token.js';

import { Address, Hex } from 'viem';
// import { Transaction } from 'brewit';
import { SmartAccount } from 'viem/account-abstraction';
import { getValidatotConfig, getSignerInfo } from '../utils.js';


// export const executeAutoSwap = async (payload: any) => {
//     logger.info('Starting DCA execution with payload:', payload);
    
//     try {
//       const { fromToken, toToken, fromChainId, toChainId, amount, accountAddress, salt } = payload;
      
//       logger.info(`Executing DCA for token: ${fromToken}, amount: ${amount}, recipient: ${accountAddress}`);


//       const {signer} = getSignerInfo();
//       if (!signer?.address) throw new Error('Signer address is required');
//       const validatorConfig = getValidatotConfig(signer.address, salt);
  
//       // Delegated account assigned to the agent
//       const delegatedAccount = await createDelegatedAccount(signer, validatorConfig, fromChainId, accountAddress);
      

//       const client = await getPublicClient(fromChainId);
//       const decimals = await getTokenDecimals(fromToken, client);
//       // Get quote from bridge/ swap API
//       const quote = await performBridge(
//         fromChainId, // sellChainId
//         toChainId, // buyChainId  
//         fromToken,
//         toToken,
//         parseUnits(amount, decimals),
//         accountAddress, // recipientAddress
//         accountAddress  // address
//       );

//       const swapTransactions: Transaction[] = [];
      
//       // Check if approval is needed (if selling token is not native)
//       if (fromToken !== '0x0000000000000000000000000000000000000000' && quote.approvalAddress) {
//         const tokenApproval = await buildApproveToken(
//           fromToken,
//           quote.approvalAddress as `0x${string}`,
//           parseUnits(amount, decimals)
//         );
//         swapTransactions.push(tokenApproval);
//       }

//       // Add the swap transaction
//       swapTransactions.push({
//         to: quote.transaction.to,
//         value: BigInt(quote.transaction.value),
//         data: quote.transaction.data,
//       });

//       // Execute the transactions
//       const result = await sendTransaction(swapTransactions, delegatedAccount as any, fromChainId);
//       console.log('Swap result:', result);
      
//       logger.info('DCA execution completed successfully');
      
//       return {
//         success: true,
//         fromToken,
//         toToken,
//         amount,
//         accountAddress,
//         timestamp: new Date().toISOString()
//       };
//     } catch (error) {
//       logger.error('DCA execution failed:', error);
//       throw error;
//     }
//   };
  
// export const executeAutoSwap = async (payload: any) => {
//     logger.info('Starting DCA execution with payload:', payload);
    
//     try {
//       const { fromToken, toToken, fromChainId, toChainId, amount, accountAddress, salt } = payload;
      
//       logger.info(`Executing DCA for token: ${fromToken}, amount: ${amount}, recipient: ${accountAddress}`);


//       const {signer} = getSignerInfo();
//       if (!signer?.address) throw new Error('Signer address is required');
//       const validatorConfig = getValidatotConfig(signer.address, salt);
  
//       // Delegated account assigned to the agent
//       const delegatedAccount = await createDelegatedAccount(signer, validatorConfig, fromChainId, accountAddress);
      

//       const client = await getPublicClient(fromChainId);
//       const decimals = await getTokenDecimals(fromToken, client);
//       // Get quote from bridge/ swap API
//       const quote = await performBridge(
//         fromChainId, // sellChainId
//         toChainId, // buyChainId  
//         fromToken,
//         toToken,
//         parseUnits(amount, decimals),
//         accountAddress, // recipientAddress
//         accountAddress  // address
//       );

//       const swapTransactions: Transaction[] = [];
      
//       // Check if approval is needed (if selling token is not native)
//       if (fromToken !== '0x0000000000000000000000000000000000000000' && quote.approvalAddress) {
//         const tokenApproval = await buildApproveToken(
//           fromToken,
//           quote.approvalAddress as `0x${string}`,
//           parseUnits(amount, decimals)
//         );
//         swapTransactions.push(tokenApproval);
//       }

//       // Add the swap transaction
//       swapTransactions.push({
//         to: quote.transaction.to,
//         value: BigInt(quote.transaction.value),
//         data: quote.transaction.data,
//       });

//       // Execute the transactions
//       const result = await sendTransaction(swapTransactions, delegatedAccount as any, fromChainId);
//       console.log('Swap result:', result);
      
//       logger.info('DCA execution completed successfully');
      
//       return {
//         success: true,
//         fromToken,
//         toToken,
//         amount,
//         accountAddress,
//         timestamp: new Date().toISOString()
//       };
//     } catch (error) {
//       logger.error('DCA execution failed:', error);
//       throw error;
//     }
//   };
  
  export class ExecutorService {
  

  async executeSend({transfers, chainId, validatorSalt, accountAddress}: {transfers: {to: Address, token: Address, amount: string}[], chainId: number, validatorSalt: Hex, accountAddress: Address}): Promise<any> {
      
      const {signer} = getSignerInfo();
  // const account = await createMainAccount(signer, 'ownable', 10143);
  if (!signer?.address) throw new Error('Signer address is required');
  const validatorConfig = getValidatotConfig(signer.address, validatorSalt);

  const delegatedAccount = await createDelegatedAccount(signer, validatorConfig, chainId, accountAddress);

  console.log(delegatedAccount)
  const transferAsset = await Promise.all(
    transfers.map(({to, token, amount}) => {
        return buildTransferAsset(chainId, token, to, amount);
    })
  );

  console.log(transferAsset)
  
  // Run both transactions simultaneously
  const tx = await sendTransaction(transferAsset, delegatedAccount as SmartAccount, chainId);
  return tx;
    }
  }

// export const executeAutoTransfer = async (payload: any) => {
//     logger.info('Starting DCA execution with payload:', payload);
    
//     try {
//       const { token, amount, accountAddress, chainId, salt } = payload;
      
//       logger.info(`Executing DCA for token: ${token}, amount: ${amount}, recipient: ${accountAddress}`);
      
//       const transaction = await buildTransferAsset(chainId, token, accountAddress, amount);
//       const {signer} = getSignerInfo();
//       if (!signer?.address) throw new Error('Signer address is required');
//       const validatorConfig = getValidatotConfig(signer.address, salt);
  
//       const delegatedAccount = await createDelegatedAccount(signer, validatorConfig, chainId, accountAddress);
//       await sendTransaction([transaction], delegatedAccount as any, chainId);
      
      
//       logger.info('DCA execution completed successfully');
      
//       return {
//         success: true,
//         token,
//         amount,
//         accountAddress,
//         chainId,
//         timestamp: new Date().toISOString()
//       };
//     } catch (error) {
//       logger.error('DCA execution failed:', error);
//       throw error;
//     }
//   };
  
