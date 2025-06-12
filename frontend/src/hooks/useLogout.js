import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
    const { dispach } = useAuthContext()
    const logout = () => {
        localStorage.removeItem('user')

        dispach({ type: 'LOGOUT'})
    }


    return { logout }
}