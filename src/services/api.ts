import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api'
})

apiClient.interceptors.request.use(async (config) => {
  try {
    // if (token) {
    //   config.headers.Authorization = token
    // }

    return config
  } catch (err) {
    console.log(err)
    return config
  }
})

export { apiClient }
