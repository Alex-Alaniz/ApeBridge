import { SwapWidget } from '@reservoir0x/relay-kit-ui'
import toast from 'react-hot-toast'

export default function Bridge() {
  const burn = async (q: { txHash: string; fromAmount: string }) => {
    await fetch('https://public.believe.app/v1/tokenomics/burn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Believe-API-Key': process.env.NEXT_PUBLIC_BELIEVE_KEY!,
      },
      body: JSON.stringify({
        type: 'BRIDGE',
        proof: { txHash: q.txHash },
        burnAmount: q.fromAmount,
        persistOnchain: true,
      }),
    })
    toast.success('Bridged & burned')
  }
  return (
    <SwapWidget
      supportedWalletVMs={['svm', 'evm']}
      popularChainIds={[792703809, 33139]}
      onConnectWallet={() => {}}
      onSwapSuccess={burn}
    />
  )
}
