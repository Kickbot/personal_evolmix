import React from 'react'
import type { IUser } from 'types/auth.types'

interface AppContextValue {
  currentUser: IUser | null
  setCurrentUser: React.Dispatch<React.SetStateAction<IUser | null>>
}

const Context = React.createContext<AppContextValue | null>(null)

export default Context
