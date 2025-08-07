import { createContext, useState } from "react";


export const AuthContext = createContext<{
    token: string | null;
    isAdmin: boolean;
    onLogin: () => void;
    onLogout: () => void;
    isLoading: boolean;
}>({
    token: null,
    isAdmin: false,
    onLogin: () => { },
    onLogout: () => { },
    isLoading: true,
});

type AuthProviderProps = {
    children: React.ReactNode;
}


export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    const handleVerifyToken = async (token: string, type: string) => {
        setIsLoading(true)
        setToken(token)

        if (type === 'admin') {
            setIsAdmin(true);
        }
    }

    const handleLogin = async () => {
        const token = localStorage.getItem('anunciaufc.token');
        const type = localStorage.getItem('anunciaufc.type');

        if (token && type) {
            handleVerifyToken(token, type);
            return;
        }else {
            handleLogout
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("anunciaufc.token");
        localStorage.removeItem("anunciaufc.type");

        setIsAdmin(false);
        setToken(null);
    }

    const value = {
        token,
        isAdmin,
        onLogin: handleLogin,
        onLogout: handleLogout,
        isLoading: isLoading,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}