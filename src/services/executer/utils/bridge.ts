import { Address } from 'viem';
import { NetworkUtil } from './networks';

interface LiFiQuote {
  type: string;
  id: string;
  tool: string;
  toolDetails: {
    key: string;
    name: string;
    logoURI: string;
  };
  action: {
    fromToken: {
      address: string;
      chainId: number;
      symbol: string;
      decimals: number;
      name: string;
      coinKey: string;
      logoURI: string;
      priceUSD: string;
    };
    fromAmount: string;
    toToken: {
      address: string;
      chainId: number;
      symbol: string;
      decimals: number;
      name: string;
      coinKey: string;
      logoURI: string;
      priceUSD: string;
    };
    fromChainId: number;
    toChainId: number;
    slippage: number;
    fromAddress: string;
    toAddress: string;
  };
  estimate: {
    tool: string;
    approvalAddress: string;
    toAmountMin: string;
    toAmount: string;
    fromAmount: string;
    feeCosts: any[];
    gasCosts: {
      type: string;
      price: string;
      estimate: string;
      limit: string;
      amount: string;
      amountUSD: string;
      token: {
        address: string;
        chainId: number;
        symbol: string;
        decimals: number;
        name: string;
        coinKey: string;
        logoURI: string;
        priceUSD: string;
      };
    }[];
    executionDuration: number;
    fromAmountUSD: string;
    toAmountUSD: string;
  };
  includedSteps: {
    id: string;
    type: string;
    action: {
      fromChainId: number;
      fromAmount: string;
      fromToken: {
        address: string;
        chainId: number;
        symbol: string;
        decimals: number;
        name: string;
        coinKey: string;
        logoURI: string;
        priceUSD: string;
      };
      toChainId: number;
      toToken: {
        address: string;
        chainId: number;
        symbol: string;
        decimals: number;
        name: string;
        coinKey: string;
        logoURI: string;
        priceUSD: string;
      };
      fromAddress: string;
      toAddress: string;
    };
    estimate: {
      tool: string;
      fromAmount: string;
      toAmount: string;
      toAmountMin: string;
      approvalAddress: string;
      executionDuration: number;
      feeCosts: any[];
      gasCosts: {
        type: string;
        price: string;
        estimate: string;
        limit: string;
        amount: string;
        amountUSD: string;
        token: {
          address: string;
          chainId: number;
          symbol: string;
          decimals: number;
          name: string;
          coinKey: string;
          logoURI: string;
          priceUSD: string;
        };
      }[];
    };
    tool: string;
    toolDetails: {
      key: string;
      name: string;
      logoURI: string;
    };
  }[];
  integrator: string;
  transactionRequest: {
    value: string;
    to: string;
    data: string;
    chainId: number;
    gasPrice: string;
    gasLimit: string;
    from: string;
  };
}

export async function performBridge(
  sellChainId: number,
  buyChainId: number,
  sellToken: Address,
  buyToken: Address,
  amount: bigint,
  sender: Address,
  receiver: Address
) {
  
  const sellNetwork = NetworkUtil.getNetworkByChainId(sellChainId);
  const buyNetwork = NetworkUtil.getNetworkByChainId(buyChainId);
  if (!sellNetwork || !buyNetwork) {
    throw new Error('Unsupported network');
  }

  const params = new URLSearchParams({
    fromChain: sellNetwork.lifiKey,
    toChain: buyNetwork.lifiKey,
    fromToken: sellToken,
    toToken: buyToken,
    fromAddress: sender,
    toAddress: receiver,
    fromAmount: amount.toString(),
    order: 'CHEAPEST',
    slippage: '0.5', // 0.5% slippage
    integrator: 'brewit',
  });

  

  // Add allowBridges and allowExchanges as arrays
  params.append('allowBridges[]', 'all');
  params.append('allowExchanges[]', 'all');

  console.log('LIFI_API_KEY', process.env.LIFI_API_KEY);
  const response = await fetch(
    `https://li.quest/v1/quote?${params.toString()}`,
    {
      headers: {
        'x-lifi-api-key': process.env.LIFI_API_KEY || '',
      },
    }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch quote from LiFi');
  }

  const data = (await response.json()) as LiFiQuote;

  // Transform LiFi response to match the expected format
  return {
    buyAmount: data.estimate.toAmount,
    buyAmountUSD: data.estimate.toAmountUSD,
    transaction: {
      to: data.transactionRequest.to as `0x${string}`,
      value: data.transactionRequest.value as `0x${string}`,
      data: data.transactionRequest.data as `0x${string}`,
      gas: data.transactionRequest.gasLimit,
      gasPrice: data.transactionRequest.gasPrice,
      chainId: data.transactionRequest.chainId,
    },
    fees: data.estimate.feeCosts.map((fee) => ({
      name: fee.name,
      description: fee.description,
      percentage: fee.percentage,
      token: fee.token?.address || '0x0000000000000000000000000000000000000000',
      amount: fee.amount || '0',
      amountUSD: fee.amountUSD,
      included: fee.included,
    })),
    tool: {
      name: data.toolDetails.name,
      logoURI: data.toolDetails.logoURI,
    },
    steps: data.includedSteps.map((step) => ({
      type: step.type,
      tool: step.toolDetails.name,
      toolLogo: step.toolDetails.logoURI,
    })),
    approvalAddress: data.estimate.approvalAddress,
    duration: data.estimate.executionDuration,
  };
}
