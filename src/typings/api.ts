import { NextApiRequest } from 'next'

export type EnhancedRequestWithAuth = NextApiRequest & {
  user: { id: string; email: string }
}
