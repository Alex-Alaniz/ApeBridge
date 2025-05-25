# Solana Wallet Integration Notes

This project currently adapts only the EVM wallet (`adaptViemWallet`) for use with the Relay `SwapWidget`.
When only a Solana wallet is connected the widget falls back to the EVM wallet which prevents
selecting Solana as the source chain.

To enable bridging **from Solana to Apechain** an `AdaptedWallet` implementation for Solana is required.
The type is defined in `@reservoir0x/relay-sdk` and expects implementations for `handleSignMessageStep`,
`handleSendTransactionStep`, `handleConfirmTransactionStep`, `address`, `getChainId`, and `switchChain`.

Relay does not currently provide a helper like `adaptViemWallet` for SVM wallets. A custom adapter will need
to:

1. Use the `@solana/wallet-adapter-react` wallet object for signing and sending transactions.
2. Construct transactions from the `TransactionStepItem` instructions supplied by Relay.
3. Return chain id `792703809` from `getChainId` and the wallet public key from `address`.

Once an adapted wallet is created it should be passed to `SwapWidget` via the `wallet` prop when a Solana
wallet is connected. Without this the widget cannot surface Solana tokens on the "Sell" side.
