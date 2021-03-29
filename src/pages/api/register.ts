import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { createUser } from '@services/server/auth'

export default nc<NextApiRequest, NextApiResponse>().post(async (req, res) => {
  const { email, password, name } = req.body
  try {
    const user = createUser({ email, password, name })
    res.send(user)
  } catch (err) {
    console.log(err)
    res.send('Error')
  }
})
