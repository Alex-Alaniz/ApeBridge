import { NextApiRequest, NextApiResponse } from 'next'
import { quote } from '../../lib/relay'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { fromChain, toChain, fromToken, toToken, amount } = req.query
  const q = await quote({
    fromChain: Number(fromChain),
    toChain: Number(toChain),
    fromToken: fromToken as string,
    toToken: toToken as string,
    amount: amount as string,
  })
  res.status(200).json(q)
}
