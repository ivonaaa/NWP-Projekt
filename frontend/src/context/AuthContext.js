import { createContext, useReducer, useEffect } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispach] = useReducer(authReducer, {
        user: null
    })

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))

        if(user) {
            dispach({ type: 'LOGIN', payload: user})
        }
    }, [])

    return (
        <AuthContext.Provider value={{...state, dispach}}>
            { children }
        </AuthContext.Provider>
    )
}