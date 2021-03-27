import { getFile, getFolder } from '@services/dam'

import { useQuery } from 'react-query'
import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from './middlewares'

const _usePreview = create(
  devtools(
    immer((set, get) => ({
      enabled: true,
      selectedId: null,
      selectedType: null,
      setPreview: (type: 'folder' | 'file', id: string) => {
        set((state) => {
          state.selectedId = id
          state.selectedType = type
        })
      },
      clear: () => {
        set((state) => {
          state.selectedId = null
          state.selectedId = null
        })
      },
      toggle: () => {
        set((state) => {
          state.enabled = !state.enabled
        })
      }
    }))
  )
)

function usePreview() {
  const preview = _usePreview()
  const {
    data: item,
    isSuccess,
    isLoading,
    refetch
  } = useQuery(
    preview.selectedType === 'file'
      ? '/dam/file/' + preview.selectedId
      : '/dam/folder/' + preview.selectedId,
    () =>
      preview.selectedType === 'file'
        ? getFile(preview.selectedId)
        : getFolder(preview.selectedId),
    { enabled: !!preview.selectedId }
  )

  return {
    item,
    refetch,
    loaded: isSuccess && !isLoading,
    ...preview
  }
}

export { usePreview }
