# Bhindi Brewit Agent on Monad

A TypeScript-based agent starter kit that demonstrates integration with Brewit Money's API for token operations. Perfect for learning agent development with the [Bhindi.io](https://bhindi.io) specification.

# What is Bhindi?
Bhindi lets you talk to your apps like you talk to a friend.
Bhindi supports 100+ integrations and is the easiest way to build AI agents.

Check a list of integrations available at [Bhindi Agents Directory](https://directory.bhindi.io/)

## 📚 Documentation

For comprehensive documentation on building agents, visit the [Bhindi Documentation](https://github.com/upsurgeio/bhindi-docs).

## 🎯 What This Starter Kit Demonstrates

This starter kit teaches you how to build agents with:
- **Token Operations** (Swap and Send tokens)
- **Brewit Money Integration** (API integration for DeFi operations)
- **Proper parameter validation** using JSON Schema
- **Advanced features** like `confirmationRequired`
- **Standardized response formats** following agent specification

## ✨ Features

### Token Operations
- **Token Swaps**: Swap between different tokens
- **Token Transfers**: Send tokens to other addresses
- **Parameter validation**: Proper error handling for invalid inputs
- **Confirmation required**: User confirmation for all token operations

### Development Features
- **Full TypeScript support** with strict typing
- **Comprehensive testing** with Jest
- **ESLint + Prettier** for code quality
- **JSON Schema validation** for parameters
- **Standardized error handling**

## 🚀 Available Tools

### Token Operation Tools

| Tool | Description | Special Features |
|------|-------------|------------------|
| `swap` | Swap between tokens | `confirmationRequired: true` |
| `send` | Send tokens to address | `confirmationRequired: true` |

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
  -d '{
    "toToken": "USDC",
    "fromToken": "ETH",
    "amount": "1.0",
    "validatorSalt": "your-validator-salt",
    "accountAddress": "your-account-address"
  }'
```

## 🧮 Usage Examples

### Token Operations

```bash
# Token Swap
curl -X POST "http://localhost:3000/tools/swap" \
  -H "Content-Type: application/json" \
  -d '{
    "toToken": "USDC",
    "fromToken": "ETH",
    "amount": "1.0",
    "validatorSalt": "your-validator-salt",
    "accountAddress": "your-account-address"
  }'

# Send Tokens
curl -X POST "http://localhost:3000/tools/send" \
  -H "Content-Type: application/json" \
  -d '{
    "toAddress": "recipient-address",
    "amount": "100",
    "token": "USDC",
    "validatorSalt": "your-validator-salt",
    "accountAddress": "your-account-address"
  }'

# Expected response:
# {
#   "success": true,
#   "responseType": "mixed",
#   "data": {
#     "name": "Monad Agent Job",
#     "repeat": 5000,
#     "times": 1,
#     "task": "swap",
#     "enabled": true
#   }
# }
```

## 🔐 Authentication

This agent requires authentication for all operations:
- **Validator Salt**: Required for transaction validation
- **Account Address**: Required for transaction execution

## 📚 API Endpoints

- `GET /tools` - Get list of available tools
- `POST /tools/:toolName` - Execute a specific tool (requires authentication)
- `GET /health` - Health check endpoint
- `GET /docs` - Swagger UI documentation (serves `public/swagger.json`)

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

## 🎓 Learning Objectives

This starter kit teaches you:

1. **Agent Architecture**: How to structure tools and services
2. **API Integration**: Integrating with Brewit Money's API
3. **Parameter Validation**: JSON Schema validation patterns
4. **Error Handling**: Proper error responses and status codes
5. **Response Formats**: Standardized success/error responses
6. **Testing**: Comprehensive test coverage patterns
7. **Tool Features**: `confirmationRequired`, parameter types

## 🔧 Advanced Features Demonstrated

- **confirmationRequired**: All token operations require confirmation
- **Parameter validation**: Type checking and required parameters
- **Error handling**: Invalid addresses, insufficient balances, etc.
- **Mixed response types**: Different data structures for different operations

## 🚀 Next Steps

Once you understand this agent, you can:

1. **Add more token operations**: Liquidity provision, staking, etc.
2. **Implement transaction history**: Track and display past operations
3. **Add more chains**: Support multiple blockchain networks
4. **Add advanced trading strategies**: Automated trading features
5. **Add rate limiting**: Protect against excessive operations
6. **Add portfolio management**: Track token balances and performance

## 📖 Agent Specification Compliance

This starter follows the [Bhindi.io](https://bhindi.io) agent specification:
- ✅ Required endpoints: `GET /tools`, `POST /tools/:toolName`
- ✅ Standardized response formats: `BaseSuccessResponseDto`, `BaseErrorResponseDto`
- ✅ JSON Schema parameter validation
- ✅ Tool confirmation
- ✅ Authentication patterns
- ✅ Proper error handling and status codes

Perfect for learning how to build production-ready agents! 🎉

## Need Help?

We're here for you! You can reach out to us at:

- **Email**: [info@bhindi.io](mailto:info@bhindi.io)
- **Twitter/X**: [@bhindiai](https://x.com/bhindiai) for the latest updates
- **Discord**: [Join our community](https://discord.gg/hSfTG33ymy)
- **Documentation**: [Bhindi Docs](https://github.com/upsurgeio/bhindi-docs)
- **Website**: [Bhindi.io](https://bhindi.io)