import { MdClose } from 'react-icons/md'
import clsx from 'clsx'
import { ToastProps } from 'react-toast-notifications'

const Toast: React.FC<ToastProps> = ({
  appearance,
  children,
  transitionState,
  onDismiss
}) => {
  const title = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info'
  }
  return (
    <div
      className={clsx(
        'flex flex-row items-center justify-between rounded-lg p-4 z-[20001] mb-4 transition-all duration-800 ease-in-out border-l-4  relative bg-gray-800 transform shadow-lg w-96',
        {
          'border-red-500': appearance === 'error',
          'border-green-500': appearance === 'success',
          'border-yellow-500': appearance === 'warning',
          'border-blue-500': appearance === 'info',
          'translate-y-full opacity-0':
            transitionState === 'exiting' || transitionState === 'entering'
        }
      )}
      style={{ zIndex: 999999 }}
    >
      <div className="flex flex-col">
        {/* <span className="font-bold">{title[appearance] || title.info}</span> */}
        <span className="text-white">{children}</span>
      </div>
      <button
        className="text-2xl ml-8 transition-all ease-in-out text-gray-400 cursor-pointer hover:text-gray-200"
        onClick={() => onDismiss()}
      >
        <MdClose />
      </button>
    </div>
  )
}

export { Toast }
