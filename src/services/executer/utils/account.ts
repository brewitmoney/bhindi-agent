import { toAccount } from 'brewit/account';
import { NetworkUtil } from './networks.js';



// Account creation functions
export const createMainAccount = async (
  signer: any,
  validatorType: 'ownable' | 'passkey',
  chainId: number
) => {
  
  const rpcEndpoint = NetworkUtil.getNetworkByChainId(chainId)?.url;
  if (!rpcEndpoint) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return await toAccount({
    chainId,
    rpcEndpoint: rpcEndpoint,
    signer: signer,
    config: { validator: validatorType },
    type: 'main',
  });
};

export const createDelegatedAccount = async (
  signer: any,
  config: any,
  chainId: number,
  safeAddress: `0x${string}`
) => {
  const network = NetworkUtil.getNetworkByChainId(chainId);
  if (!network) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  return await toAccount({
    chainId,
    safeAddress: safeAddress,
    rpcEndpoint: network.url,
    signer: signer,
    config: config,
    type: 'delegated',
  });
};


// Export the toAccount function for direct use if needed
export { toAccount };
