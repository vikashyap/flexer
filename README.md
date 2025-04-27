# Flexer - Multi-Chain Wallet Integration

Flexer is a decentralized application (dApp) that allows users to connect to and interact with multiple blockchains. This app supports both EVM and Solana wallets, enabling users to manage their portfolio seamlessly. The application integrates with the LI.FI cross-chain protocol to facilitate on-chain messages and token transfers.

## Prerequisites

Before setting up and running the project, ensure you have the following installed:

- **Node.js** (version 20.18 or higher)
  You can download it from [here](https://nodejs.org/).

- **Yarn**
  Yarn is preferred over npm or Bun. To install Yarn, run:
  ```bash
  npm install --global yarn
  ```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vikashyap/flexer.git
   cd flexer
   ```

2. Install dependencies using Yarn:

   ```bash
   yarn install
   ```

## Running the Project

To run the project locally, use the following command:

```bash
yarn dev
```

This will start the development server. You can now access the app by visiting `http://localhost:3000`.

## Building the Project

To build the project for production, use:

```bash
yarn build
```

This will compile the TypeScript files and generate optimized static files in the `dist/` directory.

## Running Tests

To run tests with Vitest, use:

```bash
yarn test
```

For continuous testing with file watching, use:

```bash
yarn test:watch
```

For running tests with coverage:

```bash
yarn test:coverage
```

## 📖 Project Journey

For an in-depth look at the development and evolution of the Flexer project, including milestones, challenges, and key decisions, please refer to the detailed project journey documented in our Notion workspace.​

👉 [Read the Full Project Journey](https://www.notion.so/Flexer-1cf8b98ebb2080f5b607e5cf092c6531?pvs=4)

This document provides insights into the project's inception, its growth phases, and the strategic choices that shaped its current state. It's a valuable resource for understanding the project's history and the thought process behind its development.

## Troubleshooting

### Common Issues

- **Missing `WagmiProvider`:**
  If you encounter the error `useConfig must be used within WagmiProvider`, ensure that you have wrapped your app with the `WagmiProvider` component in the main entry point (`App.tsx` or `index.tsx`):

  ```tsx
  import { WagmiProvider } from "wagmi";

  function App() {
    return (
      <WagmiProvider client={wagmiClient}>
        <YourApp />
      </WagmiProvider>
    );
  }
  ```

- **Missing `@wagmi/connectors`**:
  Ensure that you have installed the `@wagmi/connectors` package as it is needed for the integration of connectors like MetaMask.

  ```bash
  yarn add @wagmi/connectors
  ```

## License

MIT License
