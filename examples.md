# Bhindi Agent Starter - API Examples

This document provides examples of how to use the Bhindi Agent Starter API, which integrates with Brewit Money's API for token operations.

## Authentication

All endpoints require authentication via a validator salt and account address in the payload.

## Available Endpoints

### 1. Get Available Tools

**GET** `/tools`

Returns a list of all available tools for token operations.

```bash
curl -X GET "http://localhost:3000/tools"
```

**Response:**
```json
{
  "tools": [
    {
      "name": "swap",
      "description": "Swap tokens from one token to another",
      "parameters": {
        "type": "object",
        "properties": {
          "toToken": {
            "type": "string",
            "description": "The token to swap to"
          },
          "fromToken": {
            "type": "string",
            "description": "The token to swap from"
          },
          "amount": {
            "type": "string",
            "description": "The amount of tokens to swap"
          }
        },
        "required": ["toToken", "fromToken", "amount"]
      },
      "confirmationRequired": true
    },
    {
      "name": "send",
      "description": "Send tokens to an address from the account address",
      "parameters": {
        "type": "object",
        "properties": {
          "toAddress": {
            "type": "string",
            "description": "The address to send tokens to"
          },
          "amount": {
            "type": "string",
            "description": "The amount of tokens to send"
          },
          "token": {
            "type": "string",
            "description": "The token to send"
          }
        },
        "required": ["toAddress", "amount", "token"]
      },
      "confirmationRequired": true
    }
  ]
}
```

## Token Operations

All token operations require authentication and confirmation.

### 2. Swap Tokens

**POST** `/tools/swap`

Swap one token for another.

```bash
curl -X POST "http://localhost:3000/tools/swap" \
  -H "Content-Type: application/json" \
  -d '{
    "toToken": "USDC",
    "fromToken": "ETH",
    "amount": "1.0",
    "validatorSalt": "your-validator-salt",
    "accountAddress": "your-account-address"
  }'
```

**Response:**
```json
{
  "success": true,
  "responseType": "mixed",
  "data": {
    "name": "Monad Agent Job",
    "repeat": 5000,
    "times": 1,
    "task": "swap",
    "enabled": true
  }
}
```

### 3. Send Tokens

**POST** `/tools/send`

Send tokens to a specified address.

```bash
curl -X POST "http://localhost:3000/tools/send" \
  -H "Content-Type: application/json" \
  -d '{
    "toAddress": "recipient-address",
    "amount": "100",
    "token": "USDC",
    "validatorSalt": "your-validator-salt",
    "accountAddress": "your-account-address"
  }'
```

**Response:**
```json
{
  "success": true,
  "responseType": "mixed",
  "data": {
    "name": "Monad Agent Job",
    "repeat": 5000,
    "times": 1,
    "task": "send",
    "enabled": true
  }
}
```

## Error Responses

All endpoints return standardized error responses.

**Standard Error Format:**
```json
{
  "success": false,
  "error": {
    "message": "User-friendly error description",
    "code": 400,
    "details": ""
  }
}
```

**Common Error Scenarios:**

**Invalid Authentication (401):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid validator salt or account address",
    "code": 401,
    "details": ""
  }
}
```

**Missing Parameters (400):**
```json
{
  "success": false,
  "error": {
    "message": "Missing required parameters: toToken, fromToken, amount",
    "code": 400,
    "details": ""
  }
}
```

## Common Error Codes

- `400`: Invalid parameters or validation errors
- `401`: Invalid authentication credentials
- `403`: Insufficient permissions or rate limit exceeded
- `404`: Tool not found
- `500`: Internal server error

## Environment Setup

1. Set up your environment variables:
   ```bash
   PORT=3000
   NODE_ENV=development
   ```

2. Start the server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`.

## Use Cases

This agent is perfect for:

- **Token Swaps**: Easily swap between different tokens
- **Token Transfers**: Send tokens to other addresses
- **Automated Trading**: Set up automated token operations
- **DeFi Integration**: Integrate with Brewit Money's DeFi capabilities

## Next Steps

- Add more token operations (liquidity provision, staking, etc.)
- Implement transaction history tracking
- Add support for more token types and chains
- Implement advanced trading strategies