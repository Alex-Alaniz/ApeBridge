import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { SwapWidget, RelayKitProvider } from '@reservoir0x/relay-kit-ui'
import { useRelayChains } from '@reservoir0x/relay-kit-hooks'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useAccount, useWalletClient, useConnect } from 'wagmi'
import { adaptViemWallet } from '@reservoir0x/relay-sdk'
import dynamic from 'next/dynamic'
import '@reservoir0x/relay-kit-ui/styles.css'

// Relay API URL
const MAINNET_RELAY_API = 'https://api.relay.link'

// Make EVM wallet button client-side only to avoid hydration issues
const EVMWalletButton = dynamic(
  () => import('wagmi').then((mod) => {
    const { useConnect } = mod
    const Component = () => {
      const { connect, connectors } = useConnect()
      const { isConnected, address } = useAccount()
      
      if (isConnected) {
        return <div className="text-sm text-green-600">EVM: {address?.slice(0, 6)}...{address?.slice(-4)}</div>
      }
      
      return (
        <button 
          onClick={() => connect({ connector: connectors[0] })}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Connect EVM
        </button>
      )
    }
    return Component
  }),
  { ssr: false }
)

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Fetch Relay chains dynamically
  const { chains, viemChains } = useRelayChains(MAINNET_RELAY_API)

  // Wallet states
  const { connected: solanaConnected, publicKey: solanaPublicKey } = useWallet()
  const { isConnected: evmConnected, address: evmAddress } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { connect, connectors } = useConnect()

  // Token state for bidirectional swapping
  const [fromToken, setFromToken] = useState<any>(undefined)
  const [toToken, setToToken] = useState<any>(undefined)

  // Extract parameters from URL for deep linking support (optional)
  const amount = (router.query.amount as string) || '1'

  useEffect(() => {
    setMounted(true)
  }, [])

  // Connect wallet callback for SwapWidget
  const handleConnectWallet = () => {
    console.log('🔗 Connect wallet triggered')
    // Try to connect the first available connector (usually MetaMask/injected)
    if (connectors && connectors[0]) {
      connect({ connector: connectors[0] })
    }
  }

  if (!mounted) {
    return null // Prevent hydration issues
  }

  // Adapt EVM wallet for Relay
  const adaptedWallet = walletClient ? adaptViemWallet(walletClient) : undefined

  return (
    <>
      <Head>
        <title>Bridge to Apechain | Relay</title>
        <meta name="description" content="Bridge your assets to Apechain with Relay" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="relay-app">
        {/* Navigation Header */}
        <nav className="relay-nav flex items-center justify-between px-6">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">relay</span>
            </div>
            <div className="flex items-center space-x-1">
              <button className="relay-nav-button relay-nav-button-active">
                Swap
              </button>
              <button className="relay-nav-button text-gray-600 hover:text-gray-900">
                Transactions
              </button>
              <div className="relative">
                <button className="relay-nav-button text-gray-600 hover:text-gray-900 flex items-center">
                  More
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Site-level ConnectButton */}
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              {solanaConnected && (
                <span className="text-green-600">
                  SOL: {solanaPublicKey?.toBase58().slice(0, 6)}...{solanaPublicKey?.toBase58().slice(-4)}
                </span>
              )}
              {evmConnected && (
                <span className="text-blue-600 ml-2">
                  EVM: {evmAddress?.slice(0, 6)}...{evmAddress?.slice(-4)}
                </span>
              )}
            </div>
            <WalletMultiButton />
            <EVMWalletButton />
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="bg-gray-50 min-h-screen">
          {/* Status info */}
          <div className="text-center pt-4 pb-2">
            <div className="text-sm text-gray-600">
              🔗 Chains loaded: {chains?.length || 0} | 
              Solana: {solanaConnected ? '✅' : '❌'} | 
              EVM: {evmConnected ? '✅' : '❌'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Using Relay API: {MAINNET_RELAY_API}
            </div>
          </div>

          {/* Bridge Widget Container */}
          <div className="pt-4 flex justify-center px-6">
            <div className="w-full max-w-md">
              <RelayKitProvider
                options={{
                  appName: 'APES Bridge',
                  chains: chains || [],
                  baseApiUrl: MAINNET_RELAY_API
                }}
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Widget Tab Header */}
                  <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <button className="relay-button relay-button-primary px-4 py-2 text-sm">
                          Swap
                        </button>
                        <button className="relay-button px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                          Buy
                        </button>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Widget settings">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* SwapWidget with proper Relay integration */}
                  <div className="p-6">
                    <SwapWidget
                      // Core Relay wallet integration
                      wallet={adaptedWallet}
                      supportedWalletVMs={['svm', 'evm']}
                      onConnectWallet={handleConnectWallet}
                      // Token state
                      fromToken={fromToken}
                      setFromToken={setFromToken}
                      toToken={toToken}
                      setToToken={setToToken}
                      defaultAmount={amount}
                      onAnalyticEvent={(eventName, data) => {
                        console.log('🔔 Relay Event:', eventName, data)
                        
                        if (eventName === 'Widget Loaded') {
                          console.log('✅ Widget loaded with:', {
                            totalChains: chains?.length || 0,
                            solanaChain: chains?.find(c => c.id === 792703809),
                            apechainChain: chains?.find(c => c.id === 33139),
                            walletConnected: !!adaptedWallet,
                            solanaConnected,
                            evmConnected
                          })
                        }
                        
                        // Log all important events
                        if (eventName.toLowerCase().includes('wallet') || 
                            eventName.toLowerCase().includes('connect') ||
                            eventName.toLowerCase().includes('chain') || 
                            eventName.toLowerCase().includes('token')) {
                          console.log(`🔍 ${eventName}:`, data)
                        }
                      }}
                    />
                  </div>
                </div>
              </RelayKitProvider>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
