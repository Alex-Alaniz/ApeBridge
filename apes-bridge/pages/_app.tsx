import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  SolongWalletAdapter
} from '@solana/wallet-adapter-wallets'
import { Connection, clusterApiUrl } from '@solana/web3.js'
import { injected } from 'wagmi/connectors'
import { mainnet } from 'wagmi/chains'

// Import Solana wallet styles
require('@solana/wallet-adapter-react-ui/styles.css')

// Create a query client for TanStack Query (required by Relay hooks)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
})

// Initialize Solana wallet adapters
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new TorusWalletAdapter(),
  new LedgerWalletAdapter(),
  new SolongWalletAdapter(),
]

// Solana connection
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('mainnet-beta')
const solanaConnection = new Connection(SOLANA_RPC_URL)

// Define Apechain for wagmi
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
} as const

// Create wagmi config with Apechain and mainnet
const wagmiConfig = createConfig({
  chains: [apechain, mainnet],
  connectors: [injected()],
  transports: {
    [apechain.id]: http('https://rpc.apechain.io'),
    [mainnet.id]: http(),
  },
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <ConnectionProvider endpoint={solanaConnection.rpcEndpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <Component {...pageProps} />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
