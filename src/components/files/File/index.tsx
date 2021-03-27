import { memo } from 'react'
import { useRouter } from 'next/router'
import { ContextMenu, ContextMenuTrigger } from 'react-contextmenu'
import { useDraggable } from '@dnd-kit/core'
import { MdDelete, MdEdit, MdViewAgenda } from 'react-icons/md'
import cs from 'clsx'

import MenuItem from '@components/UI/MenuItem'
import { HiDocument } from 'react-icons/hi'
import { useFiles } from '@store/files'
import { hideMenu } from 'react-contextmenu/modules/actions'
import { usePreview } from '@store/preview'
import { useUI } from '@store/ui'

const File = ({
  id,
  name,
  extension,
  type,
  size,
  onClick,
  selected = false
}) => {
  const contextMenuId = 'context-menu-file-' + id
  const router = useRouter()
  const files = useFiles()
  const preview = usePreview()
  const ui = useUI()

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
                  'w-40 p-4  group-hover:bg-gray-100 group-hover:bg-opacity-10 rounded-lg cursor-pointer flex flex-col items-center justify-center',
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
                  router.push('/files/folder/' + id)
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
                <p className="font-bold break-words">{name}</p>
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
