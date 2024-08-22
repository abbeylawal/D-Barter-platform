# Barter Easy Smart Contract App

## Table of Contents

- [Barter Easy Smart Contract App](#barter-easy-smart-contract-app)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Architecture](#architecture)
  - [Project Structure](#project-structure)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
  - [Smart Contract](#smart-contract)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Testing](#testing)
  - [Deployment](#deployment)
  - [Troubleshooting](#troubleshooting)
  - [License](#license)

## Introduction

Barter Easy is a decentralized application (dApp) that leverages blockchain technology to create a peer-to-peer marketplace for bartering goods and services. This README provides comprehensive information on setting up, running, and understanding the project structure.

## Architecture

The Barter Easy app is built with a three-tier architecture: Frontend, Smart Contract (Blockchain), and Backend. Here's a high-level overview of how these components interact:

mermaid

- **Frontend Tier**: Built with Next.js and React, this tier handles user interactions and interfaces with both the blockchain and the backend API.
- **Blockchain Tier**: Consists of the Smart Contract deployed on the Ethereum blockchain, managing the core logic of the bartering system.

- **Backend Tier**: An Express.js server that provides additional APIs and interfaces with a database for off-chain data storage.

## Project Structure

```
.
├── api/                  # Express.js backend
├── clientclient/         # Next.js frontend and smart contract
│   ├── .next/            # Next.js build output (generated)
│   ├── node_modules/     # Frontend dependencies (generated)
│   ├── src/              # Frontend source code
│   ├── scripts/          # Deployment and other scripts
│   └── SmartContract/    # Smart contract related files
│       ├── contract/     # Solidity contract files
│       │   └── NftMarketplace.sol
│       └── test/         # Smart contract test files
└── README.md             # This file
```

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14.x or later)
- Yarn package manager
- MetaMask browser extension
- Git

## Installation

1. Clone the repository (if you haven't already):

   ```bash
   git clone <repository-url>
   cd barter-easy-app
   ```

2. Install backend dependencies:

   ```cli
   cd api
   npm install
   cd ..
   ```

3. Install frontend and smart contract dependencies:

   ```bash
   cd clientclient
   yarn install
   ```

5. Set up environment variables:
   - Create a `.env` file in the `clientclient` directory
   - Add necessary environment variables (e.g., NEXT_PUBLIC_RPC_URL, NEXT_PUBLIC_NETWORK_ID)

## Running the Project

1. Start the backend server:

   ```bash
   cd api
   npm start
   ```

3. In a new terminal, start the frontend development server:

   ```bash
   cd clientclient
   yarn run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Smart Contract

The smart contract for the NFT marketplace is located in `clientclient/SmartContract/contract/NftMarketplace.sol`. This contract handles the creation, buying, selling, and trading of NFTs on the Ethereum blockchain.

To compile and deploy the smart contract:

1. Navigate to the `clientclient` directory
2. Run `npx hardhat compile`
3. Run `npx hardhat run scripts/deploy.js --network <your-network>`

Replace `<your-network>` with the desired network (e.g., `localhost`, `rinkeby`, `mainnet`).

## Frontend

The frontend is built using Next.js and React. The main components and pages are located in the `clientclient/src` directory.

Key features:
- Web3 integration using ethers.js
- React components for displaying and interacting with NFTs
- Responsive design for various screen sizes

## Backend

The Express.js backend is located in the `api` directory. It provides necessary API endpoints for the frontend to interact with.

Key features:
- RESTful API endpoints
- Integration with the Ethereum blockchain
- Data caching and optimization

## Testing

To run tests for the smart contract:

1. Navigate to the `clientclient` directory
2. Run `npx hardhat test`

For frontend tests:

1. In the `clientclient` directory, run `yarn test`

## Deployment

1. Deploy the smart contract to your chosen Ethereum network
2. Update the frontend with the new contract address
3. Build the frontend: `yarn build`
4. Deploy the frontend to your hosting service of choice (e.g., Vercel, Netlify)
5. Deploy the backend to a suitable server or cloud service

## Troubleshooting

- Ensure MetaMask is connected to the correct network
- Clear browser cache and MetaMask activity if you encounter persistent issues
- Check console logs for any error messages

## License

This project is licensed under the [MIT License](LICENSE).