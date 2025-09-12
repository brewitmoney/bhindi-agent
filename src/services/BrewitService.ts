import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface SwapPayload {
  toToken: string;
  fromToken: string;
  validatorSalt: string;
  amount: string;
  accountAddress: string;
}

interface SendPayload {
  toAddress: string;
  amount: string;
  accountAddress: string;
  token: string;
  validatorSalt: string;
}

interface Agent {
  id: number;
  logo: string;
  name: string;
  owner: string;
  description: string;
  publish_status: string;
  signer_identifier: string;
}

interface AgentConfigResponse {
  id: number;
  created_at: string;
  salt: string;
  agent_id: number;
  account_address: string;
  policy: string;
  chainids: number[];
  key_hash: string;
  agent: Agent;
}

class BrewitError extends Error {
  status: number;
  constructor({ message, status }: { message: string; status: number }) {
    super(message);
    this.status = status;
  }
}

export class BrewitService {
  private readonly baseUrl = process.env.BREWIT_API_URL;

  async swap(payload: SwapPayload): Promise<any> {

    const response = await axios.post(`${this.baseUrl}/automation/agents/monad`, {
      name: "Monad Agent Job",
      repeat: 5000,
      times: 1,
      task: "swap",
      payload,
      enabled: true
    });
    return response.data;
  }

  async send(payload: SendPayload): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/automation/agents/monad`, {
      name: "Monad Agent Job",
      repeat: 5000,
      times: 1,
      task: "send",
      payload,
      enabled: true
    });
    return response.data;
  }

  async verifyAgentConfig(apiKey: string): Promise<AgentConfigResponse> {
    console.log(process.env.BREWIT_API_URL)

    try {
      console.log(apiKey)
      const response = await axios.get<AgentConfigResponse>(`${this.baseUrl}/accounts/agents/verify`, {
        headers: {
          'x-agent-api-key': apiKey
        }
      });
      return response.data;
    } catch (error: any) {
      const status = error?.response?.status || 500;
      const message = error?.response?.data.error || 'Failed to verify agent configuration';
      console.log(error.response.status)
      throw new BrewitError({
        message,
        status,
      });
    }
  }
  
}