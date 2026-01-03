import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store/store'
import { logoutUser } from '../../store/slices'
import Cookies from 'js-cookie'
import { resetClubProgress } from '@/store/slices/user/nextClubSlice'

const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // get rememberMe info
      const rememberedEmail = localStorage.getItem('rememberEmail')
      const rememberedPassword = localStorage.getItem('rememberPassword')

      await dispatch(logoutUser()).unwrap()

      // remove auth tokens
      Cookies.remove('token')
      Cookies.remove('token', { path: '/' })
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')

      // clear storage but preserve remembered credentials
      const tempStorage: { email?: string; password?: string } = {}
      if (rememberedEmail) tempStorage.email = rememberedEmail
      if (rememberedPassword) tempStorage.password = rememberedPassword

      localStorage.clear()
      sessionStorage.clear()
      dispatch(resetClubProgress()) 
      // restore remembered credentials
      if (tempStorage.email) localStorage.setItem('rememberEmail', tempStorage.email)
      if (tempStorage.password) localStorage.setItem('rememberPassword', tempStorage.password)

      router.push('/auth/signin')
    } catch (error) {
      console.error('❌ Logout failed:', error)
    }
  }

  return { handleLogout }
}

export default useLogout
