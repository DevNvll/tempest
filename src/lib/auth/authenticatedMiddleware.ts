import { NextApiResponse } from 'next'
import nc from 'next-connect'
import Amplify, { withSSRContext } from 'aws-amplify'
import { EnhancedRequestWithAuth } from '@typings/api'

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  },
  ssr: true
})

const middleware = nc<EnhancedRequestWithAuth, NextApiResponse>().use(
  async (req, res, next) => {
    try {
      const { Auth } = withSSRContext({ req })

      const user = await Auth.currentAuthenticatedUser()

      if (!user) {
        res.status(401).send('Forbidden')
      }

      req.user = {
        id: user.attributes.sub,
        email: user.username
      }

      next()
    } catch (err) {
      console.log(err)
      res.status(401).send('Forbidden')
    }
  }
)

const authenticated = middleware

export { authenticated }
