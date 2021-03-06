import Folder from '@components/files/Folder'
import MenuItem from '@components/UI/MenuItem'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'

import { useFiles } from '@store/files'
import { useUpload } from '@store/upload'

import { useRouter } from 'next/router'
import {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { ContextMenu, ContextMenuTrigger, hideMenu } from 'react-contextmenu'
import { HiChevronLeft, HiPlus } from 'react-icons/hi'
import { useHotkeys } from 'react-hotkeys-hook'
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
import { useMouse } from 'react-use'
import PreviewLightbox from '@components/PreviewLightbox'
import { ModalTypes } from '@constants/modal'

export default function FilesDirectory() {
  const mouseRef = useRef(null)
  const mouse = useMouse(mouseRef)
  const mousePos = useMemo(() => ({ x: mouse.docX, y: mouse.docY }), [mouse])
  const {
    state: { folder, selectedItems, loaded, empty, folderId, mode, notFound },
    operations: {
      refetch,
      clearSelection,
      handleSelect,
      findById,

      separateFilesAndFolders,
      deleteSelected,
      selectAll
    },
    mutations: { deleteItem, renameItem, moveItems }
  } = useFiles()
  const router = useRouter()
  const preview = usePreview()
  const ui = useUI()
  const upload = useUpload()

  const [isDragging, setDragging] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((i) => {
        upload.addItem(i, folderId, () => {
          setTimeout(refetch, 1000)
        })
      })
    },
    [folderId]
  )

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
          await deleteItem.mutate({ id, type: 'file' })
          ui.toast('File deleted successfully')
          refetch()
          return
        }
        case 'RENAME': {
          ui.openModal({
            modalType: ModalTypes.Rename,
            props: {
              id,
              type: 'file',
              initialName: data.name,
              onRename: async ({ id, newName }) => {
                ui.toast('File created successfully')
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
          await deleteItem.mutate({ id, type: 'folder' })
          ui.toast('Folder deleted successfully')
          return
        }
        case 'RENAME': {
          ui.openModal({
            modalType: ModalTypes.Rename,
            props: {
              id,
              type: 'folder',
              initialName: data.name,
              onRename: async () => {
                ui.toast('File renamed successfully')
              }
            }
          })
          return
        }
      }
    } else if (data.type === 'background') {
      ui.openModal({
        modalType: ModalTypes.CreateFolder,
        props: {
          parentId: folderId,
          onCreate: async () => {
            ui.toast('Folder created successfully')
          }
        }
      })
    }
  }

  useHotkeys(
    'delete',
    () => {
      deleteSelected().then(() => {
        ui.toast('Items deleted successfully')
      })
    },
    [deleteSelected]
  )
  useHotkeys(
    'ctrl+a',
    () => {
      selectAll()
    },
    [selectAll]
  )

  useEffect(() => {
    document.onkeydown = function (e) {
      if (!e.ctrlKey) return

      const code = e.which || e.keyCode

      switch (code) {
        case 65:
        case 83:
        case 87:
          e.preventDefault()
          e.stopPropagation()
          break
      }
    }
  }, [])

  return (
    <>
      <div
        className="flex flex-row w-full h-full bg-gray-900"
        onClick={function (e: React.MouseEvent<HTMLDivElement>) {
          const target = e.target as HTMLDivElement
          if (
            target.matches('.directory-item *') ||
            target.matches('.preview-pane *')
          )
            return
          clearSelection()
          preview.clear()
        }}
        ref={mouseRef}
      >
        <div className="flex flex-col py-4 w-[260px] h-full">
          <Sidebar />
        </div>

        <div className="relative flex flex-col w-full h-full">
          <input {...getInputProps} className="hidden" />
          <div className="flex flex-col w-full">
            <div className="flex items-center w-full h-16 px-4">
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
          <div
            className="flex flex-row h-[calc(100%-64px)] "
            {...getRootProps()}
          >
            <div className="w-full h-full overflow-y-scroll">
              <DndContext
                sensors={sensors}
                collisionDetection={(entries, target) => {
                  const getIntersectionRatio = (entry) => {
                    const { x: clientX, y: clientY } = mousePos
                    const isWithinX =
                      clientX > entry.offsetLeft &&
                      clientX < entry.offsetLeft + entry.width
                    const isWithinY =
                      clientY > entry.offsetTop &&
                      clientY < entry.offsetTop + entry.height

                    if (isWithinX && isWithinY) {
                      // Should compute a score to gauge how close to the center instead of a boolean
                      return true
                    }
                    return false
                  }
                  const intersections = entries.map(([_, entry]) =>
                    getIntersectionRatio(entry)
                  )

                  // Once intersections returns a score, use that to determine the best match
                  const firstIndex = intersections.findIndex(Boolean)
                  if (firstIndex !== -1) {
                    return entries[firstIndex][0]
                  }
                  return null
                }}
                onDragCancel={() => {
                  setDragging(false)
                }}
                onDragStart={() => {
                  setDragging(true)
                }}
                onDragEnd={async (e) => {
                  const targetFolderId = e.over?.id
                  const itemId = e.active?.id

                  setDragging(false)

                  if (!targetFolderId || !itemId) {
                    return
                  }

                  if (targetFolderId !== 'favorite') {
                    if (selectedItems.indexOf(itemId) !== -1) {
                      // multiple
                      const payload = separateFilesAndFolders(selectedItems)
                      await moveItems.mutate({
                        parentId: targetFolderId,
                        items: payload
                      })
                      ui.toast('Items moved successfully')
                      // refetch()
                    } else {
                      // single
                      const { type } = findById(itemId)
                      const payload = {
                        [type === 'folder' ? 'folders' : 'files']: [itemId]
                      }

                      await moveItems.mutate({
                        parentId: targetFolderId,
                        items: payload
                      })
                      ui.toast('Items moved successfully')
                      // refetch()
                    }
                  }
                }}
              >
                {loaded && !notFound ? (
                  <>
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
                            (e.target as HTMLDivElement).id ===
                              'background-grid'
                          ) {
                            clearSelection()
                          }
                        },
                        id: 'background',
                        className: clsx(
                          'h-full p-4 transition duration-500 ease-in-out ',
                          {
                            'transform scale-[.98]': isDragActive || isDragging
                          }
                        )
                      }}
                    >
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
                        <div className="flex flex-col items-center justify-center w-full min-h-full space-y-2">
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
                                  <div className="flex flex-row items-center justify-center px-4 py-2 space-x-2 font-bold text-center cursor-pointer bg-primary-300 text-primary-300 bg-opacity-10 rounded-xl">
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
                    </ContextMenuTrigger>
                  </>
                ) : !notFound ? (
                  <div className="flex items-center justify-center w-full min-h-full">
                    <BarLoader color="#4C1CAF" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full min-h-full">
                    <h1>Folder not found</h1>
                  </div>
                )}
              </DndContext>
            </div>
            <ContextMenus handleContextClick={handleContextClick} />
            <PreviewPane />
          </div>
        </div>
      </div>
      <PreviewLightbox />
    </>
  )
}
