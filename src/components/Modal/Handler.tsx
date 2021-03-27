import { useMemo } from 'react'

import ModalBase from './Base'
import { modalTypes } from '@constants/modal'
import { useUI } from '@store/ui'

const ModalHandler: React.FC = () => {
  const ui = useUI()
  const renderModals = useMemo(
    () =>
      ui.currentModals.map((m) => {
        const ModalComponent = modalTypes[m.type]
        const { customStyles } = m.props

        return (
          <ModalBase
            isOpen
            controls={m.props.controls !== undefined ? m.props.controls : true}
            key={m.type}
            customStyles={customStyles}
            close={() => {
              ui.closeModal(m.type)
            }}
          >
            {ModalComponent ? (
              <ModalComponent
                close={() => {
                  ui.closeModal(m.type)
                }}
                {...m.props}
              />
            ) : null}
          </ModalBase>
        )
      }),
    [ui.currentModals]
  )

  return <>{renderModals}</>
}

export { ModalHandler }
