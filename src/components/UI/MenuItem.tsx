import { MenuItem as ContextMenuItem } from 'react-contextmenu'
import cs from 'clsx'

const MenuItem = ({ onClick, Icon, label, data = {}, danger = false }) => {
  return (
    <ContextMenuItem
      data={data}
      onClick={onClick}
      className={cs(
        'hover:bg-primary-500 hover:bg-opacity-10 hover:text-primary-400 cursor-pointer px-6 py-3 font-bold flex flex-row space-x-4 items-center',
        {
          'hover:bg-red-500 hover:bg-opacity-10 hover:text-red-400': danger
        }
      )}
    >
      <Icon />
      <span>{label}</span>
    </ContextMenuItem>
  )
}

export default MenuItem
