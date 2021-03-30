import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { withSSRContext } from 'aws-amplify'
import { EnhancedRequestWithAuth } from '@typings/api'

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
