# Bhindi Brewit Agent

A TypeScript-based agent built using [Bhindi.io](https://bhindi.io) specification. 

# What is Brewit?
Brewit provides crypto accounts for individuals and teams. Using the Brewit agent, users can interact and perform crypto transactions on their Brewit account

# What is Bhindi?
Bhindi lets you talk to your apps like you talk to a friend.
Bhindi supports 100+ integrations and is the easiest way to build AI agents.

Check a list of integrations available at [Bhindi Agents Directory](https://directory.bhindi.io/)

## 📚 Documentation

For comprehensive documentation on building agents, visit the [Bhindi Documentation](https://github.com/upsurgeio/bhindi-docs).

Checkout [Brewit Documentation](http://docs.brewit.money) to add features to agent. 


## ✨ Features

### Token Operations
- **Token Swaps**: Swap between different tokens on any supported chain
- **Multi-Transfer Support**: Send single or multiple token transfers in a single transaction
- **Confirmation required**: User confirmation for all token operations
- **Cross-chain Support**: Works with multiple blockchain networks


## 🚀 Available Tools

### Token Operation Tools

| Tool | Description | Special Features |
|------|-------------|------------------|
| `swap` | Swap tokens from one token to another on any chain | `confirmationRequired: true` |
| `send` | Send single or multiple token transfers in a single transaction | `confirmationRequired: true` |

### Tool Parameters

#### Swap Tool
- `toToken` (string): The token address to swap to
- `fromToken` (string): The token address to swap from  
- `amount` (string): The amount of tokens to swap

#### Send Tool
- `transfers` (array): Array of token transfers to execute
  - `toAddress` (string): The recipient address to send tokens to
  - `amount` (string): The amount of token to send
  - `token` (string): The token address to send

## 📋 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Project
```bash
npm run build
```

### 3. Start the Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### 4. Test the API
```bash
# Get available tools
curl -X GET "http://localhost:3000/tools"

# Test token swap
curl -X POST "http://localhost:3000/tools/swap" \
  -H "Content-Type: application/json" \
  -H "x-agent-delegation-key: your-delegation-key" \
  -d '{
    "toToken": "0xA0b86a33E6441b8c4C8C0C4C0C4C0C4C0C4C0C4C",
    "fromToken": "0x0000000000000000000000000000000000000000",
    "amount": "1.0"
  }'

# Test multi-token send
curl -X POST "http://localhost:3000/tools/send" \
  -H "Content-Type: application/json" \
  -H "x-agent-delegation-key: your-delegation-key" \
  -d '{
    "transfers": [
      {
        "toAddress": "0x1234567890123456789012345678901234567890",
        "amount": "100",
        "token": "0xA0b86a33E6441b8c4C8C0C4C0C4C0C4C0C4C0C4C"
      }
    ]
  }'
```

## 🧮 Usage Examples

### Token Operations

```bash
# Token Swap
curl -X POST "http://localhost:3000/tools/swap" \
  -H "Content-Type: application/json" \
  -H "x-agent-delegation-key: your-delegation-key" \
  -d '{
    "toToken": "0xA0b86a33E6441b8c4C8C0C4C0C4C0C4C0C4C0C4C",
    "fromToken": "0x0000000000000000000000000000000000000000",
    "amount": "1.0"
  }'

# Single Token Transfer
curl -X POST "http://localhost:3000/tools/send" \
  -H "Content-Type: application/json" \
  -H "x-agent-delegation-key: your-delegation-key" \
  -d '{
    "transfers": [
      {
        "toAddress": "0x1234567890123456789012345678901234567890",
        "amount": "100",
        "token": "0xA0b86a33E6441b8c4C8C0C4C0C4C0C4C0C4C0C4C"
      }
    ]
  }'

# Multiple Token Transfers (Batch)
curl -X POST "http://localhost:3000/tools/send" \
  -H "Content-Type: application/json" \
  -H "x-agent-delegation-key: your-delegation-key" \
  -d '{
    "transfers": [
      {
        "toAddress": "0x1234567890123456789012345678901234567890",
        "amount": "100",
        "token": "0xA0b86a33E6441b8c4C8C0C4C0C4C0C4C0C4C0C4C"
      },
      {
        "toAddress": "0x0987654321098765432109876543210987654321",
        "amount": "50",
        "token": "0x0000000000000000000000000000000000000000"
      }
    ]
  }'

# Expected response:
{
  "success": true,
  "responseType": "mixed",
  "data": {
    "result": "Transaction hash or result data",
    "message": "Successfully executed swap operation",
    "tool_type": "brewit"
  }
}
```

## 🔐 Authentication

This agent requires authentication for all tool operations:
- **x-agent-delegation-key**: Required header for all tool execution requests
- The agent automatically verifies the delegation key and retrieves:
  - **Validator Salt**: For transaction validation
  - **Account Address**: For transaction execution
  - **Chain IDs**: Supported blockchain networks

## 📚 API Endpoints

- `GET /` - Landing page (serves README.md content)
- `GET /tools` - Get list of available tools
- `POST /tools/:toolName` - Execute a specific tool (requires x-agent-delegation-key header)
- `GET /health` - Health check endpoint
- `GET /docs` - Swagger UI documentation (serves `public/swagger.json`)
- `GET /info` - Get account information and validator configuration

## 📖 Documentation & Examples

- **[Complete API Examples](examples.md)** - Detailed usage examples for all tools with curl commands
- **Swagger Documentation** - Available at `/docs` endpoint when server is running
- **Postman Collection** - Import `Bhind-Agent-Starter.postman_collection.json` for easy testing

## 🏗️ Project Structure

```
src/
├── config/
│   └── tools.json          # Tool definitions with JSON Schema
├── controllers/
│   └── appController.ts    # Handles token operations
├── services/
│   └── BrewitService.ts   # Brewit Money API integration
├── routes/
│   ├── toolsRoutes.ts     # GET /tools endpoint
│   └── appRoutes.ts       # POST /tools/:toolName endpoint
├── middlewares/
│   ├── auth.ts            # Authentication utilities
│   └── errorHandler.ts    # Error handling middleware
├── types/
│   └── agent.ts           # Response type definitions
├── __tests__/            # Test files
├── app.ts                # Express app configuration
└── server.ts             # Server entry point
```

## 🧪 Development

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format

# Development server with auto-reload
npm run dev
```
