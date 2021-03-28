import Folder from '@components/files/Folder'
import MenuItem from '@components/UI/MenuItem'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'

import { useFiles } from '@store/files'
import { useUpload } from '@store/upload'

import { useRouter } from 'next/router'
import { MouseEvent, useCallback } from 'react'
import { ContextMenu, ContextMenuTrigger, hideMenu } from 'react-contextmenu'
import { HiChevronLeft, HiPlus } from 'react-icons/hi'
import {
  MdCreateNewFolder,
  MdDelete,
  MdEdit,
  MdViewAgenda
} from 'react-icons/md'
import File from '../File'
import Sidebar from '../Sidebar'
import FileDragOverlay from '../DragOverlay'
import { BarLoader } from 'react-spinners'
import UploadButton from '../UploadButton'
import { UploadProgress } from '../UploadProgress'
import PreviewPane from '../PreviewPane'
import { usePreview } from '@store/preview'
import { useUI } from '@store/ui'
import ContextMenus from '../ContextMenus'
import { useDropzone } from 'react-dropzone'
import clsx from 'clsx'

export default function FilesDirectory({ root = undefined }) {
  const {
    state: { folder, selectedItems, loaded, empty, folderId, mode },
    operations: {
      refetch,
      clearSelection,
      handleSelect,
      findById,
      createFolder,
      deleteItem,
      renameItem
    }
  } = useFiles(root)
  const router = useRouter()
  const preview = usePreview()
  const ui = useUI()
  const upload = useUpload()

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((i) => {
      upload.addItem(i, folderId, () => {
        setTimeout(refetch, 1000)
      })
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop
  })

  useUpload.subscribe((prev, next) => {
    if (next.progress === 100) {
      refetch()
    }
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  )

  async function handleContextClick(e, data) {
    hideMenu()
    const id = data.id

    if (data.type === 'file') {
      switch (data.action) {
        case 'VIEW': {
          router.push('/file/' + data.id)
          return
        }
        case 'DELETE': {
          await deleteItem({ id, type: 'file' })
          refetch()
          return
        }
        case 'RENAME': {
          ui.openModal({
            modalType: 'Rename',
            props: {
              id,
              type: 'file',
              onRename: async ({ id, newName }) => {
                await renameItem({ id, type: 'file', newName })
                refetch()
              }
            }
          })
          return
        }
      }
    } else if (data.type === 'folder') {
      switch (data.action) {
        case 'VIEW': {
          router.push('/folder/' + data.id)
          return
        }
        case 'DELETE': {
          await deleteItem({ id, type: 'folder' })
          refetch()
          return
        }
        case 'RENAME': {
          ui.openModal({
            modalType: 'Rename',
            props: {
              id,
              type: 'folder',
              onRename: async ({ id, newName }) => {
                await renameItem({ id, type: 'folder', newName })
                refetch()
              }
            }
          })
          return
        }
      }
    } else if (data.type === 'background') {
      ui.openModal({
        modalType: 'CreateFolder',
        props: {
          parentId: folderId,
          onCreate: ({ parentId, name }) => {
            createFolder(parentId, name)
          }
        }
      })
    }
  }

  return (
    <div
      className="h-full w-full flex flex-row bg-gray-900"
      onClick={function (e: React.MouseEvent<HTMLDivElement>) {
        const target = e.target as HTMLDivElement
        if (target.matches('.directory-item *')) return
        clearSelection()
        preview.clear()
      }}
    >
      <div className="flex flex-col py-4 w-[260px] h-full bg-gray-800">
        <Sidebar />
      </div>

      <div className="flex flex-col w-full flex-grow h-full  relative">
        <input {...getInputProps} className="hidden" />
        <div className="flex flex-col w-full">
          <div className="h-16 w-full flex items-center px-4">
            <div className="flex flex-row space-x-2">
              <button
                disabled={!folder || folder?.root}
                className={
                  (!folder || folder?.root) && 'opacity-50 cursor-default'
                }
                onClick={() => {
                  router.back()
                }}
              >
                <HiChevronLeft />
              </button>
              <p className="font-bold">{folder?.name || 'Files'}</p>
            </div>
          </div>
          <UploadProgress />
        </div>
        <div className="flex flex-row h-full" {...getRootProps()}>
          <div className="w-full h-full">
            <DndContext
              sensors={sensors}
              onDragEnd={(e) => {
                const targetFolderId = e.over?.id
                const itemId = e.active?.id

                if (!targetFolderId || !itemId) {
                  return
                }

                if (targetFolderId !== 'favorite') {
                  if (selectedItems.indexOf(itemId) !== -1) {
                    // multiple
                    const payload = {
                      folders: selectedItems
                        .map((i) => findById(i))
                        .filter((i) => i.type === 'folder'),
                      files: selectedItems
                        .map((i) => findById(i))
                        .filter((i) => i.type === 'file')
                    }
                    console.log('move', payload, 'to', targetFolderId)
                  } else {
                    // single
                    const { type } = findById(itemId)
                    console.log('move', type, itemId, 'to', targetFolderId)
                  }
                }
              }}
            >
              <FileDragOverlay />
              <ContextMenuTrigger
                id="bg"
                holdToDisplay={99999999}
                collect={() => ({
                  folderId,
                  type: 'background'
                })}
                attributes={{
                  onClick: (e) => {
                    hideMenu()
                  },
                  onMouseDown: (e: MouseEvent<HTMLDivElement>) => {
                    if (
                      (e.target as HTMLDivElement).id === 'background' ||
                      (e.target as HTMLDivElement).id === 'background-grid'
                    ) {
                      clearSelection()
                    }
                  },
                  id: 'background',
                  className: clsx(
                    'h-full p-4 transition duration-500 easi-in-out',
                    {
                      'transform scale-[.98]': isDragActive
                    }
                  )
                }}
              >
                {loaded ? (
                  <>
                    {!empty ? (
                      <div
                        className="grid gap-4 grid-cols-fill-40"
                        id="background-grid"
                      >
                        {folder.folders.map((f) => {
                          return (
                            <Folder
                              id={f.id}
                              key={f.id}
                              name={f.name}
                              numberOfItems={f.numberOfItems}
                              onClick={handleSelect}
                              selected={Boolean(
                                selectedItems.find((i) => i === f.id)
                              )}
                            />
                          )
                        })}
                        {folder.files.map((f) => {
                          return (
                            <File
                              id={f.id}
                              key={f.id}
                              name={f.name}
                              extension={f.extension}
                              size={f.size}
                              type={f.mimeType}
                              onClick={handleSelect}
                              selected={Boolean(
                                selectedItems.find((i) => i === f.id)
                              )}
                            />
                          )
                        })}
                      </div>
                    ) : (
                      <div className="w-full min-h-full flex flex-col space-y-2 items-center justify-center">
                        {mode === 'files' ? (
                          <>
                            <h1 className="text-2xl font-bold">
                              No Files Here
                            </h1>
                            <p className="text-sm font-thin">
                              Upload your first file
                            </p>
                            <div>
                              <UploadButton id="directory">
                                <div className="px-4 py-2 font-bold bg-primary-300 text-primary-300 bg-opacity-10 rounded-xl text-center cursor-pointer flex flex-row items-center justify-center space-x-2">
                                  <HiPlus />
                                  <span>Upload File</span>
                                </div>
                              </UploadButton>
                            </div>
                          </>
                        ) : (
                          <>
                            <h1 className="text-2xl font-bold">
                              No Files Here
                            </h1>
                            <p className="text-sm font-thin">
                              This folder is empty
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full min-h-full flex items-center justify-center">
                    <BarLoader color="#4C1CAF" />
                  </div>
                )}
              </ContextMenuTrigger>
            </DndContext>
          </div>
          <ContextMenus handleContextClick={handleContextClick} />
          <PreviewPane />
        </div>
      </div>
    </div>
  )
}
