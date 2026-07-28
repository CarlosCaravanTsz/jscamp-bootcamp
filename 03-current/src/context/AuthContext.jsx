// import { createContext, useState, use } from "react"; // use en lugar de useContext

// // 1. Crear el contexto
// export const AuthContext = createContext()

// // 2. Crear el provider
// export function AuthProvider({ children }) {
//   const [isLoggedIn, setIsLoggedIn] = useState(false)

//   const login = () => setIsLoggedIn(true)

//   const logout = () => setIsLoggedIn(false)

//   const value = {
//     isLoggedIn,
//     login,
//     logout
//   }

//   return <AuthContext value={value} >
//     {children}
//   </AuthContext>
// }


// // 3. Crear el custom hook con validacion
// /**
//  * Hook para acceder al contexto de autenticación
//  *
//  * @returns {Object} Objeto con isLogin, login y logout
//  * @throws {Error} Si se usa fuera de AuthProvider
//  *
//  * @example
//  * function MyComponent() {
//  *   const { isLogin, login, logout } = useAuth()
//  *   return <button onClick={login}>Login</button>
//  * }
//  */
// export function useAuth() {
//   const context = use(AuthContext)

//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }

//   return context
// }