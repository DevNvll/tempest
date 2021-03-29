import {
  ToastProvider as _ToastProvider,
  useToasts
} from 'react-toast-notifications'
import { useEffect } from 'react'
import { Toast } from '.'
import { useUI } from '@store/ui'

const placements = {
  'top-left': { top: 0, left: 0 },
  'top-center': { top: 0, left: '50%', transform: 'translateX(-50%)' },
  'top-right': { top: 0, right: 0 },
  'bottom-left': { bottom: 0, left: 0 },
  'bottom-center': { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
  'bottom-right': { bottom: 0, right: 0 }
}

const ToastContainer = ({ hasToasts, placement, ...props }) => (
  <div
    className="react-toast-notifications__container"
    style={{
      boxSizing: 'border-box',
      maxHeight: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      padding: 8,
      pointerEvents: hasToasts ? null : 'none',
      position: 'fixed',
      zIndex: 12000,
      ...placements[placement]
    }}
    {...props}
  />
)

const ToastMessageHandler: React.FC = () => {
  const messages = useUI(
    (state) => state.messages,
    (l, r) => l.length === r.length
  )

  const clearMessages = useUI((state) => state.clearToasts)

  const { addToast } = useToasts()

  useEffect(() => {
    if (messages && messages.length) {
      messages.forEach((message) => {
        addToast(message.message, { appearance: message.type })
      })
      setTimeout(() => clearMessages())
    }
  }, [messages])

  return null
}

const ToastProvider = ({ children }) => (
  <_ToastProvider
    components={{ Toast: Toast, ToastContainer }}
    autoDismiss
    autoDismissTimeout={6000}
    placement="bottom-center"
  >
    <ToastMessageHandler />
    {children}
  </_ToastProvider>
)

export { ToastProvider }
