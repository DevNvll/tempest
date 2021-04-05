import axios from 'axios'
import { Auth } from 'aws-amplify'

const apiClient = axios.create({
  baseURL: '/api'
})

apiClient.interceptors.request.use(async (config) => {
  return new Promise((resolve, reject) => {
    Auth.currentSession()
      .then((session) => {
        var idTokenExpire = session.getIdToken().getExpiration()
        var refreshToken = session.getRefreshToken()
        var currentTimeSeconds = Math.round(+new Date() / 1000)
        if (idTokenExpire < currentTimeSeconds) {
          Auth.currentAuthenticatedUser().then((res) => {
            res.refreshSession(refreshToken, (err, data) => {
              if (err) {
                Auth.signOut()
              } else {
                config.headers.Authorization =
                  'Bearer ' + data.getIdToken().getJwtToken()
                resolve(config)
              }
            })
          })
        } else {
          console.log('Bearer ' + session.getIdToken().getJwtToken())
          config.headers.Authorization =
            'Bearer ' + session.getIdToken().getJwtToken()
          resolve(config)
        }
      })
      .catch(() => {
        resolve(config)
      })
  })
})

export { apiClient }
