# ApeBridge x Relay Integration — Engineer Handoff

## TL;DR
- **Current bug:** UI only allows bridging **from Apechain to Solana** (not the other way). This is ironic, because there is no liquidity on Apechain and we are trying to bring it there. (Yes, that's the joke.)
- **Goal:** Enable true bidirectional bridging (Solana ↔ Apechain) using the official [Relay](https://www.relay.link/bridge) widget and wallet integration patterns.

---

## What We Implemented

### 1. **RelayKit Integration**
- Uses `@reservoir0x/relay-kit-ui` and `@reservoir0x/relay-kit-hooks` for the SwapWidget and chain discovery.
- Loads chain metadata dynamically from the [Relay API](https://api.relay.link/chains) using `useRelayChains(MAINNET_RELAY_API)`.
- No hardcoded chain config; all chains come from the live API.

### 2. **Wallet Integration**
- **EVM:** Uses Wagmi, RainbowKit, and `adaptViemWallet(walletClient)` to pass the EVM signer to the widget.
- **Solana:** Uses `@solana/wallet-adapter-react` and `@solana/wallet-adapter-react-ui` for SVM wallet support (Phantom, Solflare, etc).
- **Widget Connect:** Implements `onConnectWallet` callback so the widget can trigger wallet modals.
- **supportedWalletVMs:** Set to `['svm','evm']` so both wallet types are supported.

### 3. **UI/UX**
- Navbar has site-level wallet connect buttons for both EVM and Solana.
- Widget is passed the correct wallet and connect callback props.
- All token and chain discovery is dynamic (no hardcoded lists).
- Logging and debug output for wallet/chain/token events.

---

## What Is Still Broken / What Needs To Be Done

### ❌ **Current Bug**
- **You can only bridge from Apechain → Solana.**
    - The "Sell" (from) side only shows Apechain tokens.
    - The "Buy" (to) side works perfectly (shows both Solana and Apechain tokens).
    - You cannot select Solana as the "from" chain, so you can't bridge from Solana to Apechain.
- **Root cause:**
    - The widget is not surfacing Solana tokens in the "Sell" section, even when a Solana wallet is connected.
    - This is likely a bug in how wallet context is passed, or a missing prop/config in the widget.
    - All chains and tokens are loaded from the API, so this is not a static config issue.

### 🛠️ **What Needs To Be Done**
- **Investigate why Solana is not available as a source chain in the widget.**
    - Double-check wallet context propagation and widget props.
    - Compare with the official [Relay bridge UI](https://www.relay.link/bridge) and their wallet handling.
    - Try using the multiWalletSupportEnabled and related props if needed.
- **Ensure that when a Solana wallet is connected, the widget allows selecting Solana as the "Sell" chain.**
- **If needed, reach out to Relay support or check for open issues in their SDK/UI.**

---

## Reference Docs & Links
- [Relay Bridge UI](https://www.relay.link/bridge) — Official reference for UX and wallet handling
- [RelayKit UI Docs](https://docs.relay.link/references/relay-kit/ui/SwapWidget)
- [RelayKit Hooks Docs](https://docs.relay.link/references/relay-kit/hooks/useRelayChains)
- [Relay SDK Docs](https://docs.relay.link/references/sdk/createClient)
- [Relay API: Chains](https://api.relay.link/chains)
- [Relay API: Currencies](https://api.relay.link/currencies/v1)

---

## Environment Variables
- **None required for local dev** (all API endpoints are public)
- If you want to override Solana RPC, set `NEXT_PUBLIC_SOLANA_RPC_URL` in `.env.local` (optional)

---

## Secrets
- **None required** for public API usage and wallet connect
- If deploying to production, secure any private keys or sensitive env vars (not needed for this widget)

---

## Setup Script
```bash
# Change to the project directory
cd apes-bridge

# Install dependencies
yarn install
# or
npm install

# Run the dev server
yarn dev
# or
npm run dev
```

**No build steps or custom scripts required.**

---

## Codex/AI Agent Guidance
- **You can browse the web during the setup script.**
- After setup, internet is disabled, so all docs you need should be included in this file or referenced above.
- If you need to see the live widget, visit [https://www.relay.link/bridge](https://www.relay.link/bridge) before setup ends.
- All code is in `pages/index.tsx` and wallet config is in `pages/_app.tsx`.
- The main bug is: **Solana is not available as a source chain in the widget, even when a Solana wallet is connected.**
- If you fix this, please document the change and why it worked!

---

## Contact
- If you need help, check the [Relay Discord](https://discord.gg/relayprotocol) or their [docs](https://docs.relay.link/).

---

**Good luck! And remember: the real liquidity is the friends we made along the way.** 