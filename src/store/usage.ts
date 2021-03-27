import { getStorage } from '@services/user'
import { useQuery } from 'react-query'

function useStorage(folderId?: string) {
  const { data: usage, isSuccess, isLoading, refetch } = useQuery(
    '/user/storage/',
    getStorage
  )

  return {
    usage,
    refetch
  }
}

export { useStorage }
