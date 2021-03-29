import { getFile, getFolder } from '@services/client/dam'
import { ItemType } from '@typings/files'

import { useQuery } from 'react-query'
import create, { State } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from './middlewares'

interface PreviewStore extends State {
  enabled: boolean
  selectedId: string
  selectedType: string
  setPreview: (type: ItemType, id: string) => void
  clear: () => void
  toggle: () => void
}

const _usePreview = create<PreviewStore>(
  devtools(
    immer((set, get) => ({
      enabled: true,
      selectedId: null,
      selectedType: null,
      setPreview: (type: ItemType, id: string) => {
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
