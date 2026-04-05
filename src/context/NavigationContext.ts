import { createContext, useContext } from 'react'

// Any component can call navigate(id) to trigger curtain + scroll
export const NavigationContext = createContext<(id: string) => void>(() => {})
export const useNavigation = () => useContext(NavigationContext)
