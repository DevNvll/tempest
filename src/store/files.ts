import { getFolder, getRootFolder } from '@services/dam'
import { ModalTypes } from 'constants/modal'
import { useQuery } from 'react-query'
import { ItemType } from 'typings/files'
import { ModalType } from 'typings/ui'
import create from 'zustand'
import { immer } from './middlewares'
import { devtools } from 'zustand/middleware'
import { useMemo } from 'react'
import { useRouter } from 'next/router'

type State = {
  selectedItems: string[]
  lastSelected: number
  setSelectedItems: (items) => void
  setLastSelected: (id) => void
  clearSelection: () => void
}

const _useFiles = create<State>(
  devtools(
    immer((set) => ({
      selectedItems: [],
      lastSelected: null,
      setSelectedItems: (items) =>
        set((state) => {
          state.selectedItems = items
        }),
      setLastSelected: (id) =>
        set((state) => {
          state.lastSelected = id
        }),
      clearSelection: () =>
        set((state) => {
          state.selectedItems = []
          state.lastSelected = -1
        })
    }))
  )
)

function useFiles(folderId?: string) {
  const router = useRouter()

  const _folderId = folderId || (router.query.folder_id as string)

  const {
    data: folder,
    isSuccess,
    isLoading,
    refetch
  } = useQuery(
    '/dam/folders/' + (_folderId || ''),
    () => (_folderId ? getFolder(_folderId) : getRootFolder()),
    { enabled: _folderId !== null || !!_folderId }
  )

  const loaded = useMemo(() => isSuccess && !isLoading, [isSuccess, isLoading])
  const empty = useMemo(
    () => folder && !folder.files.length && !folder.folders.length,
    [folder]
  )

  const {
    selectedItems,
    setSelectedItems,
    lastSelected,
    setLastSelected,
    clearSelection,
    ...files
  } = _useFiles()

  const allItems = useMemo(
    () =>
      loaded
        ? [
            ...folder.files.map((f) => {
              f.type = 'file'
              return f
            }),
            ...folder.folders.map((f) => {
              f.type = 'folder'
              return f
            })
          ]
        : [],
    [loaded, folder]
  )

  function handleSelect(id: string, withShift?: boolean) {
    const foldersIds = folder.folders.map((i) => i.id)
    const filesIds = folder.files.map((i) => i.id)
    const allItems = [...foldersIds, ...filesIds]

    const lastSelectedIndex = lastSelected
    let newSelectedItems

    const index = allItems.findIndex((i) => i === id)

    const item = allItems.find((i) => i === id)
    if (selectedItems.find((i) => i && i === id)) {
      setSelectedItems([item])
      setLastSelected(index)
    } else {
      if (withShift && selectedItems.length > 0) {
        if (lastSelectedIndex >= index) {
          newSelectedItems = [].concat.apply(
            selectedItems,
            allItems.slice(index, lastSelectedIndex)
          )
        } else {
          newSelectedItems = [].concat.apply(
            selectedItems,
            allItems.slice(lastSelectedIndex + 1, index + 1)
          )
        }
        setSelectedItems(newSelectedItems)
      } else {
        setSelectedItems([item])
      }
      setLastSelected(index)
    }
  }

  function findById(id: string) {
    return allItems.find((i) => i.id === id)
  }

  return {
    state: {
      folderId: _folderId,
      allItems,
      selectedItems,
      lastSelected,
      folder,
      loaded,
      empty
    },
    operations: {
      setLastSelected,
      refetch,
      handleSelect,
      clearSelection,
      setSelectedItems,
      findById
    }
  }
}

export { useFiles }
