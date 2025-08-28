import axios from 'axios';

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

export class BrewitService {
  private readonly baseUrl = 'https://api.brewit.money';

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
}