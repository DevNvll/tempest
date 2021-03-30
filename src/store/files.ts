import * as services from '@services/client/dam'
import { useMutation, useQuery } from 'react-query'
import { ItemType } from 'typings/files'
import create, { State } from 'zustand'
import { immer } from './middlewares'
import { devtools } from 'zustand/middleware'
import { useMemo } from 'react'
import { useRouter } from 'next/router'

interface FilesStore extends State {
  selectedItems: string[]
  lastSelected: number
  setSelectedItems: (items: string[]) => void
  setLastSelected: (index: number) => void
  clearSelection: () => void
}

const _useFiles = create<FilesStore>(
  immer((set) => ({
    selectedItems: [],
    lastSelected: null,
    setSelectedItems: (items) =>
      void set((state) => {
        state.selectedItems = items
      }),
    setLastSelected: (index: number) =>
      void set((state) => {
        state.lastSelected = index
      }),
    clearSelection: () =>
      void set((state) => {
        state.selectedItems = []
        state.lastSelected = -1
      })
  }))
)

function useFiles() {
  const router = useRouter()

  const _folderId = router.query.folder_id as string

  function getMode() {
    if (router.pathname.startsWith('/files/trash')) {
      return 'trash'
    } else {
      return 'files'
    }
  }

  function getRootEndpoint() {
    return {
      files: '',
      trash: 'trash'
    }[getMode()]
  }

  const { data: folder, isSuccess, isLoading, refetch } = useQuery(
    ['/dam/folders/', _folderId ? _folderId : getMode()],
    () => services.getFolder(_folderId || getRootEndpoint()),
    { enabled: !!_folderId || router.pathname.startsWith('/files') }
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
      folder
        ? [
            ...folder?.files.map((f) => {
              f.type = 'file'
              return f
            }),
            ...folder?.folders.map((f) => {
              f.type = 'folder'
              return f
            })
          ]
        : [],
    [folder]
  )

  function findById(id: string) {
    return allItems.find((i) => i.id === id)
  }

  function separateFilesAndFolders(itemIds: string[]) {
    const payload = {
      folders: itemIds
        .map((i) => findById(i))
        .filter((i) => i.type === 'folder')
        .map((i) => i.id),
      files: itemIds
        .map((i) => findById(i))
        .filter((i) => i.type === 'file')
        .map((i) => i.id)
    }

    return payload
  }

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

  const createFolderMutation = useMutation('/dam/folder', services.createFolder)

  const createFolder = (parentId: string, name: string) =>
    createFolderMutation.mutateAsync({ parentId, name })

  const renameItemMutation = useMutation('/dam/', services.renameItem)

  const renameItem = async ({
    id,
    newName,
    type
  }: {
    id: string
    newName: string
    type: ItemType
  }) => renameItemMutation.mutateAsync({ id, newName, type })

  const deleteItemMutation = useMutation('/dam/', services.deleteItem)

  const deleteItem = async ({ type, id }: { id: string; type: ItemType }) =>
    deleteItemMutation.mutateAsync({ id, type })

  async function deleteSelected() {
    console.log(selectedItems)
    const payload = separateFilesAndFolders(selectedItems)

    await services.deleteItems(payload)
    refetch()
  }

  async function selectAll() {
    setSelectedItems(allItems.map((i) => i.id))
  }

  return {
    state: {
      folderId: folder?.id || _folderId,
      mode: getMode(),
      allItems,
      selectedItems,
      lastSelected,
      folder,
      loaded: !isLoading,
      notFound: !isLoading && !isSuccess,
      empty
    },
    operations: {
      setLastSelected,
      refetch,
      handleSelect,
      clearSelection,
      setSelectedItems,
      selectAll,
      findById,
      createFolder,
      renameItem,
      deleteItem,
      deleteSelected,
      separateFilesAndFolders
    }
  }
}

export { useFiles }
