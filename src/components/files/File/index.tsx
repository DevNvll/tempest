import { memo, useState } from 'react'
import { useRouter } from 'next/router'
import { ContextMenuTrigger } from 'react-contextmenu'
import { useDraggable } from '@dnd-kit/core'

import cs from 'clsx'

import { HiDocument } from 'react-icons/hi'
import { useFiles } from '@store/files'
import { usePreview } from '@store/preview'
import { useUI } from '@store/ui'

const File = ({
  id,
  name: initialName,
  extension,
  type,
  size,
  onClick,
  selected = false
}) => {
  const router = useRouter()
  const files = useFiles()
  const preview = usePreview()
  const ui = useUI()

  const [name, setName] = useState(initialName)

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id
  })

  return (
    <>
      <div
        className="select-none cursor-default"
        ref={setNodeRef}
        {...attributes}
        {...listeners}
      >
        <div>
          <div className="group directory-item">
            <ContextMenuTrigger
              id="file-context-menu"
              collect={() => {
                return { id, type: 'file' }
              }}
              holdToDisplay={999999}
              attributes={{
                className: cs(
                  'w-40 p-4 max-h-[400px] group-hover:bg-gray-100 group-hover:bg-opacity-10 rounded-lg cursor-pointer flex flex-col items-center justify-center',
                  {
                    'bg-gray-100 bg-opacity-10': selected
                  }
                ),
                onClick: (e) => {
                  if (!isDragging) {
                    preview.setPreview('file', id)
                    onClick(id, e.shiftKey)
                  }
                },
                onDoubleClick: () => {
                  if (
                    !isDragging &&
                    ['image', 'video', 'audio'].includes(type)
                  ) {
                    preview.openLightbox('file', id)
                  }
                }
              }}
            >
              <div>
                {type === 'image' ? (
                  <img
                    src={'/api/dam/thumbnails/' + id}
                    onError={(e) => {
                      const image: any = e.target

                      const source = image.src
                      setTimeout(function () {
                        image.onerror = null
                        image.src = source
                      }, 2000)
                    }}
                    className="w-full h-28 rounded overflow-hidden object-cover pointer-events-none"
                  />
                ) : (
                  <div className="w-28 h-28 rounded overflow-hidden pointer-events-none relative flex items-center justify-center">
                    <span className="z-10 text-primary-300 self-center text-xs font-bold">
                      {extension}
                    </span>
                    <HiDocument
                      className={cs(
                        'w-28 h-28 text-gray-500  absolute top-0 left-0',
                        {
                          'group-hover:text-gray-900': !selected,
                          'text-gray-900': selected
                        }
                      )}
                    />
                  </div>
                )}
              </div>
              <div className="text-center w-full mt-2 space-y-2">
                <p
                  // contentEditable={files.state.mode === 'files'}
                  className="font-bold text-sm break-words overflow-hidden bg-transparent cursor-pointer w-full"
                  // onBlur={async (e) => {
                  //   if (name === initialName) return
                  //   await files.operations.renameItem({
                  //     id,
                  //     type: 'file',
                  //     newName: e.currentTarget.innerText
                  //   })
                  // }}
                  // onInput={(e) => setName(e.currentTarget.innerText)}
                >
                  {initialName}
                </p>

                <p className="text-xs font-light">{size}</p>
              </div>
            </ContextMenuTrigger>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(File)
