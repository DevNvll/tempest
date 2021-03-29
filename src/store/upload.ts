import create from 'zustand'
import { immer } from './middlewares'
import { uploadFile } from '@services/client/dam'

async function upload(file: File, parentId: string, onProgress) {
  await uploadFile(file, parentId, onProgress)
  return file
}

// @ts-ignore
const useUpload = create(
  immer((set, get) => ({
    queue: [],
    pendingPromise: false,
    progress: 0,
    uploading: false,
    items: 0,
    addItem: (file: File, parentId: string, onReady) => {
      set((state) => {
        state.queue.push({ file, parentId, onReady })
        state.uploading = true
        state.items += 1
      })
      get().next()
    },
    next: () => {
      const pending = get().pendingPromise
      if (pending) {
        return
      }
      if (get().queue.length === 0) {
        set((state) => {
          state.uploading = false
          state.items = 0
        })

        return
      }
      set((state) => {
        const item = state.queue.shift()

        state.pendingPromise = true
        state.currentUpload = item
        upload(item.file, item.parentId, (event) => {
          set((state) => {
            state.progress = (event.loaded * 100) / event.total
          })
        })
          .then((r) => {
            set((state) => {
              state.pendingPromise = false
              state.progress = 0
            })
            item.onReady()

            get().next()
          })
          .catch((err) => {
            set((state) => {
              state.pendingPromise = false
              state.progress = 0
            })
            get().next()
          })
      })
    }
  }))
)

export { useUpload }
