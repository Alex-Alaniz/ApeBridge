import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { Connection, clusterApiUrl } from '@solana/web3.js'

// Apechain configuration
const APECHAIN_RPC_URL = process.env.NEXT_PUBLIC_APECHAIN_RPC_URL || 'https://rpc.apechain.io'

// Solana configuration
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('mainnet-beta')
export const solanaConnection = new Connection(SOLANA_RPC_URL)

// Ethereum configuration (for Apechain)
const ALCHEMY_RPC_URL = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
  : undefined

const INFURA_RPC_URL = process.env.NEXT_PUBLIC_INFURA_API_KEY
  ? `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
  : undefined

// Use Alchemy as primary, fallback to Infura
const MAINNET_RPC_URL = ALCHEMY_RPC_URL || INFURA_RPC_URL

if (!MAINNET_RPC_URL) {
  console.warn('No RPC URL provided. Please set NEXT_PUBLIC_ALCHEMY_API_KEY or NEXT_PUBLIC_INFURA_API_KEY')
}

// Check if Reservoir is configured
export const RESERVOIR_API_KEY = process.env.NEXT_PUBLIC_RESERVOIR_API_KEY
const hasReservoir = !!RESERVOIR_API_KEY
if (!hasReservoir) {
  console.warn('Reservoir API key not found. NFT operations will be disabled.')
}

// Define Apechain
const apechain = {
  id: 33139,
  name: 'Apechain',
  nativeCurrency: {
    decimals: 18,
    name: 'APE',
    symbol: 'APE',
  },
  rpcUrls: {
    default: { http: ['https://rpc.apechain.io'] },
  },
}

// Define Solana for Relay (note: this is for UI purposes, actual Solana interactions use @solana/web3.js)
const relaySolana = {
  id: 792703809, // Relay's Solana chain ID
  name: 'Solana',
  nativeCurrency: {
    decimals: 9,
    name: 'SOL',
    symbol: 'SOL',
  },
  rpcUrls: {
    default: { http: [SOLANA_RPC_URL] },
  },
}

export const config = createConfig({
  chains: [apechain, relaySolana, mainnet], // Include Solana via Relay
  connectors: [
    injected(),
  ],
  transports: {
    [apechain.id]: http(APECHAIN_RPC_URL),
    [relaySolana.id]: http(SOLANA_RPC_URL),
    [mainnet.id]: http(MAINNET_RPC_URL),
  },
}) 