import dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";

import "hardhat-contract-sizer";
import "hardhat-gas-reporter";

import { HardhatUserConfig } from "hardhat/config";
import type { HttpNetworkUserConfig } from "hardhat/types";

import "./tasks/deploy-adapters";
import "./tasks/deploy-mastercopy";
import "./tasks/deploy-proxy";
import "./tasks/deploy-standalone";

// Load environment variables.
dotenv.config();
const {
  INFURA_KEY,
  PK,
  MNEMONIC,
  ETHERSCAN_API_KEY,
  GNOSISSCAN_API_KEY,
  POLYGONSCAN_API_KEY,
  ARBISCAN_API_KEY,
  MOONSCAN_API_KEY,
} = process.env;

const sharedNetworkConfig: HttpNetworkUserConfig = {};
if (PK) {
  sharedNetworkConfig.accounts = [PK];
} else {
  sharedNetworkConfig.accounts = {
    mnemonic:
      MNEMONIC ||
      "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat",
  };
}

const config: HardhatUserConfig = {
  paths: {
    artifacts: "build/artifacts",
    cache: "build/cache",
    sources: "contracts",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.21",
        settings: {
          evmVersion: "shanghai",
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    mainnet: {
      ...sharedNetworkConfig,
      url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    },
    gnosis: {
      ...sharedNetworkConfig,
      url: "https://rpc.gnosischain.com",
    },
    sepolia: {
      ...sharedNetworkConfig,
      url: `https://sepolia.infura.io/v3/${INFURA_KEY}`,
    },
    matic: {
      ...sharedNetworkConfig,
      url: "https://rpc-mainnet.maticvigil.com",
    },
    mumbai: {
      ...sharedNetworkConfig,
      url: "https://rpc.ankr.com/polygon_mumbai",
    },
    arbitrum: {
      ...sharedNetworkConfig,
      url: "https://arb1.arbitrum.io/rpc",
    },
    moonbase: {
      ...sharedNetworkConfig,
      url: 'https://moonbase.unitedbloc.com',
    },
    moonriver: {
      ...sharedNetworkConfig,
      url: 'https://moonriver.unitedbloc.com:2000',
    },
    moonbeam: {
      ...sharedNetworkConfig,
      url: 'https://rpc.api.moonbeam.network',
    },
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
      sepolia: ETHERSCAN_API_KEY,
      gnosis: GNOSISSCAN_API_KEY,
      matic: POLYGONSCAN_API_KEY,
      mumbai: POLYGONSCAN_API_KEY,
      arbitrum: ARBISCAN_API_KEY,
      moonbase: MOONSCAN_API_KEY,
      moonriver: MOONSCAN_API_KEY,
      moonbeam: MOONSCAN_API_KEY,
    } as Record<string, string>,
    customChains: [
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          apiURL: "https://api.gnosisscan.io/api",
          browserURL: "https://www.gnosisscan.io",
        },
      },
      {
        network: "matic",
        chainId: 137,
        urls: {
          apiURL: "https://api.polygonscan.com/api",
          browserURL: "https://www.polygonscan.com",
        },
      },
      {
        network: "mumbai",
        chainId: 80001,
        urls: {
          apiURL: "https://api-testnet.polygonscan.com/api",
          browserURL: "https://mumbai.polygonscan.com",
        },
      },
      {
        network: "arbitrum",
        chainId: 42161,
        urls: {
          apiURL: "https://api.arbiscan.io/api",
          browserURL: "https://www.arbiscan.io",
        },
      },
      {
        network: "moonbeam",
        chainId: 1284,
        urls: {
          apiURL: 'https://api-moonbeam.moonscan.io/api',
          browserURL: 'https://moonscan.io/',
        },
      },
      {
        network: "moonriver",
        chainId: 1285,
        urls: {
          apiURL: 'https://moonriver.moonscan.io/api',
          browserURL: 'https://moonriver.moonscan.io/',
        },
      },
      {
        network: "moonbase",
        chainId: 1287,
        urls: {
          apiURL: 'https://moonbase.moonscan.io/api',
          browserURL: 'https://moonbase.moonscan.io/',
        },
      },
    ],
  },
  gasReporter: {
    enabled: true,
  },
};

export default config;
