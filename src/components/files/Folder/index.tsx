import { memo, useState } from 'react'
import { useRouter } from 'next/router'
import { ContextMenuTrigger } from 'react-contextmenu'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { MdFolder } from 'react-icons/md'
import cs from 'clsx'

import { useFiles } from '@store/files'
import { usePreview } from '@store/preview'
import { useUI } from '@store/ui'

const Folder = ({
  id,
  name: initialName,
  numberOfItems = 0,
  onClick,
  selected = false
}) => {
  const router = useRouter()
  const { state, operations } = useFiles()
  const preview = usePreview()
  const ui = useUI()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    active
  } = useDraggable({
    id
  })

  const [name, setName] = useState(initialName)

  const { setNodeRef: setDroppableNodeRef, isOver, over } = useDroppable({
    id,
    disabled:
      state.selectedItems.length > 1 &&
      state.selectedItems.find((i) => i === active)
        ? Boolean(state.selectedItems.find((i) => i === id))
        : active === id
  })

  async function handleClick(e, data) {}

  return (
    <div
      className="select-none"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <div
        className={cs('rounded border-2 border-dashed directory-item', {
          'border-primary-500': isOver,
          ' border-transparent': !isOver
        })}
        ref={setDroppableNodeRef}
      >
        <div>
          <ContextMenuTrigger
            id="folder-context-menu"
            collect={() => {
              return { id, type: 'folder' }
            }}
            holdToDisplay={999999}
            attributes={{
              className: cs(
                ' p-4 w-40 hover:bg-gray-100 hover:bg-opacity-10 rounded-lg cursor-pointer flex flex-col items-center justify-center',
                {
                  'bg-gray-100 bg-opacity-10': selected
                }
              ),
              onDoubleClick: () => {
                router.push('/files/folder/' + id)
              },
              onClick: (e) => {
                if (!isDragging) {
                  preview.setPreview('folder', id)
                  onClick(id, e.shiftKey)
                }
              }
            }}
          >
            <div className=" w-28 h-28 flex items-center justify-center py-4">
              <MdFolder className="text-primary-500 text-8xl" />
            </div>
            <div className="text-center w-full mt-2  space-y-2">
              <p
                // contentEditable={state.mode === 'files'}
                className="font-bold text-sm break-words overflow-hidden bg-transparent cursor-pointer w-full"
                // onBlur={async (e) => {
                //   if (name === initialName) return
                //   await operations.renameItem({
                //     id,
                //     type: 'folder',
                //     newName: e.currentTarget.innerText
                //   })
                // }}
                // onInput={(e) => setName(e.currentTarget.innerText)}
              >
                {initialName}
              </p>
              <p className="text-xs font-light">
                {numberOfItems > 0 ? numberOfItems + ' items' : 'Empty'}
              </p>
            </div>
          </ContextMenuTrigger>
        </div>
      </div>
    </div>
  )
}

export default memo(Folder)
