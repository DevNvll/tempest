import Button from '@components/UI/Button'
import Input from '@components/UI/Input'
import { renameItem } from '@services/client/dam'
import { useFiles } from '@store/files'
import { ItemType } from '@typings/files'
import { ModalProps } from '@typings/modal'
import produce from 'immer'

import { Form, Formik } from 'formik'
import { useMutation, useQueryClient } from 'react-query'

export interface RenameItemModalProps {
  id: string
  type: ItemType
  initialName: string
  onRename: (params: { id: string; newName: string; type: ItemType }) => void
}

const ModalRename: React.FC<ModalProps<RenameItemModalProps>> = ({
  id,
  type,
  initialName,
  onRename,
  close
}) => {
  const files = useFiles()

  async function handleRename(values) {
    const payload = {
      id,
      type,
      newName: values.name
    }
    files.mutations.renameItem.mutate(payload)
    onRename(payload)
    close()
  }

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-2xl font-bold">Rename Folder</h1>
      <Formik onSubmit={handleRename} initialValues={{ name: initialName }}>
        {({ isSubmitting }) => {
          return (
            <Form>
              <div className="flex flex-col w-full space-y-4">
                <Input name="name" placeholder="Folder name" autoFocus />
                <div className="flex flex-row self-end space-x-2 w-full justify-end">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      close()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button isLoading={isSubmitting}>Rename</Button>
                </div>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default ModalRename
