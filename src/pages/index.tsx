import MainLayout from '@components/Layouts/Main'
import { useUI } from '@store/ui'
export default function IndexPage() {
  const ui = useUI()
  return (
    <div>
      {' '}
      <button onClick={() => ui.toast('test')}>Toast</button>
    </div>
  )
}

IndexPage.Layout = MainLayout
