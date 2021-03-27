import { useDndContext } from '@dnd-kit/core'
import { useFiles } from '@store/files'
import { useMemo, useRef } from 'react'
import { HiOutlineCheck } from 'react-icons/hi'
import { useMouse } from 'react-use'

export default function FileDragOverlay() {
  const mouseRef = useRef(null)
  const mouse = useMouse(mouseRef)
  const mousePos = useMemo(() => ({ x: mouse.docX, y: mouse.docY }), [mouse])
  const dndContext = useDndContext()

  const files = useFiles()

  const style = dndContext.active
    ? {
        top: mousePos.y + 'px',
        left: mousePos.x + 'px',
        position: 'absolute'
      }
    : {}

  const item = useMemo(
    () => files.state.allItems.find((i) => i.id === dndContext.active) || {},
    [dndContext.active, files.state.allItems]
  )

  return (
    <div ref={mouseRef} className="pointer-events-none">
      {dndContext.active && (
        <div
          style={style as React.CSSProperties}
          className="px-4 py-2 bg-gray-900 rounded shadow-lg flex flex-row space-x-2 min-w-42 "
        >
          <div className="flex flex-row space-x-2 items-center justify-center">
            <span>
              <HiOutlineCheck className="text-green-500 text-2xl" />
            </span>
            <div>
              {files.state.selectedItems.length > 1 ? (
                <div className="flex flex-col">
                  <span className="font-bold">Multiple items selected</span>
                  <span className="font-light text-sm">
                    {files.state.selectedItems.length} items
                  </span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="font-bold">{item.name}</span>
                  <span className="font-light text-sm">
                    {item.type === 'folder'
                      ? item.numberOfItems
                        ? item.numberOfItems + ' items'
                        : 'Empty'
                      : item.extension}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
