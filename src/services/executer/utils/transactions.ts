import { createAccountClient, Transaction } from "brewit";
import { SmartAccount } from "viem/account-abstraction";
import { NetworkUtil } from "./networks.js";


export const sendTransaction = async (calls: Transaction[], account: SmartAccount, chainId: number) => {
  const bundler = NetworkUtil.getNetworkByChainId(chainId)?.bundler;
  if (!bundler) {
    throw new Error(`No bundler found for chainId: ${chainId}`);
  }

  const client = createAccountClient(
    account as any,
    bundler
  );

  const tx = await client.sendUserOperation({ calls });
  console.log(tx);
};
