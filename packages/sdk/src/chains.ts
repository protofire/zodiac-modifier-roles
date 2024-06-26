export const chains = {
  [1]: {
    name: "mainnet",
    prefix: "eth",
    subgraph:
      "https://api.studio.thegraph.com/query/23167/zodiac-roles-mainnet/v2.2.0",
  },
  [100]: {
    name: "gnosis",
    prefix: "gno",
    subgraph:
      "https://api.studio.thegraph.com/query/23167/zodiac-roles-gnosis/v2.2.0",
  },
  [137]: {
    name: "polygon",
    prefix: "matic",
    subgraph:
      "https://api.studio.thegraph.com/query/23167/zodiac-roles-polygon/v2.2.0",
  },
  [42161]: {
    name: "arbitrumOne",
    prefix: "arb1",
    subgraph:
      "https://api.studio.thegraph.com/query/23167/zodiac-roles-arbitrum-one/v2.2.0",
  },
  [43114]: {
    name: "avalanche",
    prefix: "avax",
    subgraph:
      "https://api.studio.thegraph.com/query/23167/zodiac-roles-avalanche/v2.2.0",
  },
  [8453]: {
    name: "base",
    prefix: "base",
    subgraph:
      "https://api.studio.thegraph.com/query/23167/zodiac-roles-base/v2.2.0",
  },
  [11155111]: {
    name: "sepolia",
    prefix: "sep",
    subgraph:
      "https://api.studio.thegraph.com/query/23167/zodiac-roles-sepolia/v2.2.0",
  },
} as const

// The default eth-sdk config covers alls supported chains, except gnosis.
export const ethSdkConfig = {
  etherscanURLs: {
    gnosis: "https://api.gnosisscan.io/api",
  },
  etherscanKeys: {
    gnosis: "8ENCUFT4D3XVJS7N9ZFS5Z9XQPNUGRKSN5",
  },
  rpc: {
    gnosis: "https://rpc.gnosischain.com",
  },
  networkIds: {
    gnosis: 100,
  },
} as const
