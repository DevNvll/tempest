import jwt from 'jsonwebtoken'
import { NextApiRequest } from 'next'

export default async function getSession(req: NextApiRequest) {
  const { token } = req.cookies

  const { _id, username } = jwt.verify(token, process.env.JWT_SECRET)

  return { _id, username }
}
