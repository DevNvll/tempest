import Amplify from 'aws-amplify'

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  },
  ssr: true
})
