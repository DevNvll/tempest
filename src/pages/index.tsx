import MainLayout from '@components/Layouts/Main'
import { useUI } from '@store/ui'

export default function IndexPage() {
  const ui = useUI()
  return (
    <div>
      aaaa{' '}
      <button
        onClick={() => {
          ui.openModal({
            modalType: 'MoveItem',
            props: { type: 'file', id: '123' }
          })
        }}
      >
        Open modal
      </button>
    </div>
  )
}

IndexPage.Layout = MainLayout
