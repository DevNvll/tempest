import * as services from '@services/client/dam'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { ItemType } from 'typings/files'
import create, { State } from 'zustand'
import { immer } from './middlewares'
import { devtools } from 'zustand/middleware'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import produce from 'immer'
import cuid from 'cuid'

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
  const queryClient = useQueryClient()

  const _folderId = router.query.folder_id as string
  const folderQueryKey = ['/dam/folders/', _folderId ? _folderId : getMode()]

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

  const {
    data: folder,
    isSuccess,
    isLoading,
    refetch
  } = useQuery(
    folderQueryKey,
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
    () => (folder ? [...folder?.files, ...folder?.folders] : []),
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

  const createFolder = useMutation(services.createFolder, {
    onSettled: async (newFolder) => {
      await queryClient.cancelQueries(folderQueryKey)

      const folders: any = queryClient.getQueryData(folderQueryKey)

      let newFolders = produce(folders, (draft) => {
        draft.folders.push(newFolder)
      })

      queryClient.setQueryData(folderQueryKey, (old) => newFolders)
    }
  })

  const renameItem = useMutation(services.renameItem, {
    onMutate: async (variables) => {
      await queryClient.cancelQueries(folderQueryKey)

      const folders: any = queryClient.getQueryData(folderQueryKey)

      let newFolders = produce(folders, (draft) => {
        if (variables.type === 'folder') {
          const id = draft.folders.findIndex((f) => f.id === variables.id)
          draft.folders[id].name = variables.newName
        } else {
          const id = draft.files.findIndex((f) => f.id === variables.id)
          draft.files[id].name = variables.newName
        }
      })

      queryClient.setQueryData(folderQueryKey, (old) => newFolders)

      return { folders }
    },
    onSettled: () => {
      queryClient.invalidateQueries(folderQueryKey)
    }
  })

  const deleteItem = useMutation(services.deleteItem, {
    onMutate: async (variables) => {
      await queryClient.cancelQueries(folderQueryKey)

      const folder: any = queryClient.getQueryData(folderQueryKey)

      let newFolder = produce(folder, (draft) => {
        if (variables.type === 'folder') {
          draft.folders = draft.folders.filter((f) => f.id !== variables.id)
        } else {
          draft.files = draft.files.filter((f) => f.id !== variables.id)
        }
      })

      queryClient.setQueryData(folderQueryKey, (old) => newFolder)

      return { folder }
    },
    onSettled: () => {
      queryClient.invalidateQueries(folderQueryKey)
    }
  })

  const moveItems = useMutation(services.moveItems, {
    onMutate: async (variables) => {
      await queryClient.cancelQueries(folderQueryKey)

      const folder: any = queryClient.getQueryData(folderQueryKey)

      let newFolder = produce(folder, (draft) => {
        const targetId = draft.folders.findIndex(
          (f) => f.id === variables.parentId
        )

        const files = variables.items.files || []
        const folders = variables.items.folders || []

        draft.folders[targetId].numberOfItems =
          draft.folders[targetId].numberOfItems + folders.length + files.length

        draft.folders = draft.folders.filter((f) => !folders.includes(f.id))
        draft.files = draft.files.filter((f) => !files.includes(f.id))
      })

      queryClient.setQueryData(folderQueryKey, (old) => newFolder)

      return { folder }
    },
    onSettled: () => {
      queryClient.invalidateQueries(folderQueryKey)
    }
  })

  async function deleteSelected() {
    const payload = separateFilesAndFolders(selectedItems)

    await services.deleteItems(payload)
    refetch()
  }

  async function selectAll() {
    setSelectedItems(allItems.map((i) => i.id))
  }

  return {
    state: {
      folderId: _folderId || getMode(),
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
      deleteSelected,
      separateFilesAndFolders
    },
    mutations: {
      createFolder,
      renameItem,
      deleteItem,
      moveItems
    }
  }
}

export { useFiles }
