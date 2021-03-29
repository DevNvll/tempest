// Modules Import
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Auth } from 'aws-amplify'

import create, { State } from 'zustand'
import { immer } from './middlewares'

interface UserStore extends State {
  user: any
  loading: boolean
  setUser: (user: any) => void
}

const _useAuth = create<UserStore>(
  immer((set, get) => ({
    user: null,
    loading: true,
    setUser: (user: any) => {
      set((state) => {
        state.user = user
        state.loading = false
      })
    }
  }))
)

export default function useAuth() {
  const setUser = _useAuth((store) => store.setUser)
  const loading = _useAuth((store) => store.loading)
  const user = _useAuth((store) => store.user)

  const checkUser = useCallback(async () => {
    try {
      const user = await Auth.currentAuthenticatedUser()
      setUser(user)
    } catch (err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    checkUser()
  }, [])

  return {
    state: { loading: loading, user: user },
    operations: {}
  }
}
