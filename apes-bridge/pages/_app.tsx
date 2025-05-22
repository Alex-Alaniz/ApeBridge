import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { RelayKitProvider, MAINNET_RELAY_API } from '@reservoir0x/relay-kit-ui'

const queryClient = new QueryClient()

const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <RelayKitProvider
        options={{ appName: 'APES Bridge', baseApiUrl: MAINNET_RELAY_API }}
      >
        <WagmiProvider config={wagmiConfig}>
          <Component {...pageProps} />
        </WagmiProvider>
      </RelayKitProvider>
    </QueryClientProvider>
  )
}
