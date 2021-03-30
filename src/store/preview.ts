import { getFile, getFolder } from '@services/client/dam'
import { ItemType } from '@typings/files'

import { useQuery } from 'react-query'
import create, { State } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from './middlewares'

interface PreviewStore extends State {
  lightbox: boolean
  enabled: boolean
  selectedId: string
  selectedType: string
  setPreview: (type: ItemType, id: string) => void
  openLightbox: (type: ItemType, id: string) => void
  closeLightbox: () => void
  clear: () => void
  toggle: () => void
}

const _usePreview = create<PreviewStore>(
  devtools(
    immer((set, get) => ({
      enabled: true,
      lightbox: false,
      selectedId: null,
      selectedType: null,
      setPreview: (type: ItemType, id: string) => {
        set((state) => {
          state.selectedId = id
          state.selectedType = type
        })
      },
      openLightbox: (type: ItemType, id: string) => {
        set((state) => {
          state.lightbox = true
          state.selectedId = id
          state.selectedType = type
        })
      },
      closeLightbox: () => {
        set((state) => {
          state.lightbox = false
          state.selectedId = null
        })
      },
      clear: () => {
        set((state) => {
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
