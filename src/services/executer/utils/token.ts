import {
  Address,
  Chain,
  createPublicClient,
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  Hex,
  http,
  parseEther,
  parseUnits,
  PublicClient,
  zeroAddress,
} from 'viem';
import { Transaction } from 'brewit';
import { NetworkUtil } from './networks.js';
import { arbitrum, base, baseSepolia, bsc, gnosis, mainnet, optimism, polygon, sepolia, monadTestnet } from 'viem/chains';

export function fixDecimal(number: string, decimals: number) {
  return parseFloat(number)
    .toFixed(decimals)
    .replace(/\.?0+$/, '');
}

export async function getTokenBalance(
  tokenAddress: string,
  account: string,
  client: PublicClient
) {
  // Get token balance
  const [balance, decimals] = await Promise.all([
    client.readContract({
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [account as `0x${string}`],
    }),
    client.readContract({
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: 'decimals',
    }),
  ]);

  return formatUnits(balance, decimals);
}

export function isNativeToken(tokenAddress: string) {
  const nativeTokens = [
    zeroAddress,
    '0x0000000000000000000000000000000000001010',
  ];
  return nativeTokens.includes(tokenAddress);
}

export async function getTokenDecimals(
  tokenAddress: string,
  client: PublicClient
) {
  // Ethereum provider (you can use Infura or any other provider)

  // Connect to the ERC-20 token contract

  const decimals = await client.readContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  return decimals;
}

export function buildTransferToken(to: Address, value: bigint) {
  return encodeFunctionData({
    abi: erc20Abi,
    functionName: 'transfer',
    args: [to, value],
  });
}

export async function buildApproveToken(
  tokenAddress: Address,
  spender: Address,
  value: bigint
) {
  // Ethereum provider (you can use Infura or any other provider)

  const call: Transaction = {
    to: tokenAddress as Hex,
    value: parseEther('0'),
    data: '0x',
  };

  // // Encode the transfer function data using viem
  call.data = encodeFunctionData({
    abi: erc20Abi,
    functionName: 'approve',
    args: [spender, value],
  });

  return call;
}

export async function buildTransferAsset(
  chainId: number,
  token: Address,
  toAddress: Address,
  tokenValue: string
): Promise<Transaction> {
  try {
    let call: Transaction = {
      to: '' as Hex,
      value: parseEther('0'),
      data: '0x',
    };
    if (isNativeToken(token)) {
      call = {
        to: toAddress as Hex,
        value: parseEther(tokenValue),
        data: '0x',
      };
    } else {
      const client = await getPublicClient(chainId);
      const parseAmount = parseUnits(
        tokenValue.toString(),
        await getTokenDecimals(token!, client)
      );
      call.data = buildTransferToken(toAddress, parseAmount) as Hex;
      call.to = token as Hex;
    }

    return call; // Return the result if needed
  } catch (e) {
    console.log('error', e);
    throw e; // Rethrow the error for handling in the component
  }
}

export const getChain = (chainId: number): Chain => {
  return [
    mainnet,
    base,
    polygon,
    baseSepolia,
    optimism,
    arbitrum,
    sepolia,
    bsc,
    gnosis,
    monadTestnet,
  ].find((chain: any) => chain.id == chainId) as Chain;
};

export const getPublicClient = (chainId: number): any => {
  return createPublicClient({
    chain: getChain(chainId),
    transport: http(NetworkUtil.getNetworkByChainId(chainId)?.url),
  });
};

