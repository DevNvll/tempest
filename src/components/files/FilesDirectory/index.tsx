import Folder from '@components/files/Folder'
import MenuItem from '@components/UI/MenuItem'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'

import { useFiles } from '@store/files'
import { useUpload } from '@store/upload'

import { useRouter } from 'next/router'
import { MouseEvent } from 'react'
import { ContextMenu, ContextMenuTrigger, hideMenu } from 'react-contextmenu'
import { HiChevronLeft, HiPlus } from 'react-icons/hi'
import { MdCreateNewFolder } from 'react-icons/md'
import File from '../File'
import Sidebar from '../Sidebar'
import FileDragOverlay from '../DragOverlay'
import { BarLoader } from 'react-spinners'
import UploadButton from '../UploadButton'
import { UploadProgress } from '../UploadProgress'
import PreviewPane from '../PreviewPane'
import { usePreview } from '@store/preview'
import { useUI } from '@store/ui'

export default function FilesDirectory() {
  const {
    state: { folder, selectedItems, loaded, empty, folderId },
    operations: {
      refetch,
      clearSelection,
      handleSelect,
      findById,
      createFolder
    }
  } = useFiles()
  const router = useRouter()
  const preview = usePreview()
  const ui = useUI()

  useUpload.subscribe((prev, next) => {
    if (next.progress === 100) {
      refetch()
    }
  })

  function handleBackgroundContextClick(e, data) {
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  )

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
      <div className="flex flex-col w-full flex-grow h-full">
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
        <div className="flex flex-row h-full">
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
                  folderId
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
                  className: 'h-full p-4'
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
                        <h1 className="text-2xl font-bold">No Files Here</h1>
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
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full min-h-full flex items-center justify-center">
                    <BarLoader color="#4C1CAF" />
                  </div>
                )}

                <ContextMenu
                  id="bg"
                  className="bg-gray-500 rounded overflow-hidden shadow-lg w-56"
                >
                  <MenuItem
                    onClick={handleBackgroundContextClick}
                    label="Create Folder"
                    Icon={MdCreateNewFolder}
                  />
                </ContextMenu>
              </ContextMenuTrigger>
            </DndContext>
          </div>
          <PreviewPane />
        </div>
      </div>
    </div>
  )
}
