import Button from '@components/UI/Button'
import Input from '@components/UI/Input'
import { createFolder } from '@services/client/dam'
import { useFiles } from '@store/files'
import { ModalProps } from '@typings/modal'
import { Form, Formik } from 'formik'

export interface CreateFolderModalProps {
  parentId: string
  onCreate: (params: { parentId: string; name: string }) => void
}

const ModalCreateFolder: React.FC<ModalProps<CreateFolderModalProps>> = ({
  parentId,
  onCreate,
  close
}) => {
  const files = useFiles()

  async function handleCreate(values) {
    const payload = {
      parentId,
      name: values.name
    }
    await files.mutations.createFolder.mutateAsync(payload)
    onCreate(payload)
    close()
  }

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-2xl font-bold">Create Folder</h1>
      <Formik onSubmit={handleCreate} initialValues={{ name: '' }}>
        {({ isSubmitting }) => {
          return (
            <Form>
              <div className="flex flex-col w-full space-y-4">
                <Input name="name" placeholder="Folder name" />
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
                  <Button isLoading={isSubmitting}>Create</Button>
                </div>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default ModalCreateFolder
