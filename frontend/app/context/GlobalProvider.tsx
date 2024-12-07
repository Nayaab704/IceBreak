import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getToken } from "../../lib/authTools";
import { tokenLogin } from "../../api/authApi";
import socket, { disconnectSocket, joinGroup, leaveGroup } from "../../api/socket";

interface IGlobalContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    user: {id: string, username: string} | null;
    setUser: React.Dispatch<React.SetStateAction<{id: string, username: string} | null>>;
    isLoading: boolean;
}

interface GlobalProviderProps {
    children: ReactNode;
}

const GlobalContext = createContext<IGlobalContextType | undefined>(undefined);
export const useGlobalContext = () => {
    const context = useContext(GlobalContext)
    if(!context) {
        throw new Error("useGlobalContext must be used within a GlobalProvider")
    }
    return context
}

const GlobalProvider : React.FC<GlobalProviderProps> = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    

    /*
        Attempts to log in a user with a JWT token
    */
    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                setIsLoading(true)
                const token = await getToken()
                if(token) {
                    const res = await tokenLogin(token)
                    setIsLoggedIn(true)
                    setUser(res)
                }
            } catch (error) {
                console.log("Token validation failed", error)
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }

        getCurrentUser()
    }, [])

    useEffect(() => {
        if(user) {
            socket.connect()
            joinGroup(user.id)
        } else {
            leaveGroup()
            socket.disconnect()
        }

    }, [user])

    return(
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading
            }}
        >
            {children}
        </GlobalContext.Provider>
    )

}

export default GlobalProvider