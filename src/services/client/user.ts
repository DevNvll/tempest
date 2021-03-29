import { apiClient } from './api'

export async function getStorage() {
  const { data } = await apiClient.get('/user/storage')
  return data
}
