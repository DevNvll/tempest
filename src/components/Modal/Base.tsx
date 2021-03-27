// Modules Import
import Modal from 'react-modal'
import merge from 'lodash/merge'

// CSS Import
import styles from './modal.module.css'
import { HiX } from 'react-icons/hi'

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflow: 'hidden',
    borderRadius: '0.75rem'
  },
  overlay: {
    zIndex: 10000
  }
}

Modal.setAppElement('#__next')

const ModalBase = ({
  close,
  isOpen,
  children,
  onAfterClose = null,
  customStyles,
  controls
}) => {
  const mergedStyles = merge({}, modalStyles, customStyles)

  function closeModal() {
    if (onAfterClose) {
      onAfterClose()
    }
    close()
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={mergedStyles}
      className={styles.Modal}
      overlayClassName={styles.Overlay}
    >
      {controls ? (
        <div
          className="absolute top-0 right-0 p-4 text-xl text-gray-400 cursor-pointer hover:text-gray-200 xxxxl:text-5xl"
          onClick={closeModal}
        >
          <HiX />
        </div>
      ) : null}

      {children}
    </Modal>
  )
}

export default ModalBase
