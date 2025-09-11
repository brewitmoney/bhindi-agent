import { Request, Response } from 'express';
import { BrewitService } from '../services/BrewitService.js';
import { ExecutorService } from '../services/executer/index.js';
import { BaseSuccessResponseDto, BaseErrorResponseDto } from '../types/agent.js';
import { Address, Hex } from 'viem';

/**
 * App Controller
 * Handles both Brewit tools (public, no auth) and GitHub tools (authenticated)
 * Demonstrates mixed authentication patterns for educational purposes
 */
export class AppController {
  private brewitService: BrewitService;
  private executorService: ExecutorService;

  constructor() {
    this.brewitService = new BrewitService();
    this.executorService = new ExecutorService();
  }

  /**
   * Handle tool execution - routes to appropriate handler based on tool type
   */
  async handleTool(req: Request, res: Response): Promise<void> {
    const { toolName } = req.params;
    const params = req.body;

    try {
      // Handle Brewit Tools
      if (this.isBrewitTool(toolName)) {
        await this.handleBrewitTool(toolName, params, req, res);
        return;
      }



      // Unknown tool
      const errorResponse = new BaseErrorResponseDto(
        `Unknown tool: ${toolName}`,
        404,
        `Available tools: ${this.getBrewitTools().join(', ')}`
      );
      res.status(404).json(errorResponse);
    } catch (error) {
      const errorResponse = new BaseErrorResponseDto(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500,
        'Tool execution failed'
      );
      res.status(500).json(errorResponse);
    }
  }

  /**
   * Handle brewit tool execution
   */
  private async handleBrewitTool(toolName: string, params: any, req: Request, res: Response): Promise<void> {
    let result;
    const headers = this.extractHeaders(req);
    const agentDelegationKey = headers.agentDelegationKey;

    const agentConfig = await this.brewitService.verifyAgentConfig(agentDelegationKey);

    switch (toolName) {
      case 'send': {
     
        try {
        result = await this.executorService.executeSend({
          transfers: params.transfers.map((transfer: any) => ({
            to: transfer.toAddress,
            token: transfer.token,
            amount: transfer.amount
          })),
          chainId: agentConfig.chainids[0] as number,
          validatorSalt: agentConfig.salt as Hex,
          accountAddress: agentConfig.account_address as Address
        });
        } catch (error) {
          console.log(error)
          throw new Error('Don\'t have enough balance or permission to send');
        }
        break;
      }
      
      case 'swap': {
        // const swapPayload = {
        //   toToken: params.toToken,
        //   fromToken: params.fromToken,
        //   amount: params.amount
        // };
        // result = await this.brewitService.swap({
        //   ...swapPayload,
        //   accountAddress: headers.accountAddress,
        //   validatorSalt: headers.validatorSalt
        // });
        break;
      }
      
      default:
        throw new Error(`Unknown brewit tool: ${toolName}`);
    }

    const response = new BaseSuccessResponseDto({
      result,
      message: `Successfully executed ${toolName} operation`,
      tool_type: 'brewit'
    }, 'mixed');

    res.json(response);
  }

  /**
   * Validate required parameters
   */
  private validateSwapParameters(params: any): void {
    const required = ['toToken', 'fromToken', 'validatorSalt', 'amount', 'accountAddress'];
    for (const param of required) {
      if (params[param] === undefined || params[param] === null) {
        throw new Error(`Missing required parameter: ${param}`);
      }
      if (typeof params[param] !== 'string') {
        throw new Error(`Parameter '${param}' must be a string`);
      }
    }
  }




    /**
   * Extract Validator Salt and Account Address from request headers
   */
    private extractHeaders(req: Request): { agentDelegationKey: string } {

      const agentDelegationKey = req.headers['x-agent-delegation-key'];

      if (!agentDelegationKey || typeof agentDelegationKey !== 'string') {
        throw new Error('Missing or invalid x-agent-delegation-key header');
      }


      return { agentDelegationKey };
    }

  /**
   * Check if tool is a brewit tool
   */
  private isBrewitTool(toolName: string): boolean {
    return this.getBrewitTools().includes(toolName);
  }

  /**
   * Get list of brewit tools
   */
  private getBrewitTools(): string[] {
    return ['send', 'swap'];
  }
} 