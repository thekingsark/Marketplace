import { AppContext, AppContextType } from '@/app/app-provider'
import { useContext } from 'react'

const useGlobalContext = () => {
  return useContext(AppContext) as AppContextType
}

export default useGlobalContext
