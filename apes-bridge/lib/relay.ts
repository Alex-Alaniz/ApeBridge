import { getClient, getQuote, execute, getExecutionStatus } from '@reservoir0x/relay-sdk'

export const relay = getClient({ apiKey: process.env.NEXT_PUBLIC_RELAY_KEY! })
export const quote = (p: Parameters<typeof getQuote>[1]) => getQuote(relay, p)
export const swap = (q: any, s: any) => execute(relay, { quote: q, signer: s })
export const status = (id: string) => getExecutionStatus(relay, id)
