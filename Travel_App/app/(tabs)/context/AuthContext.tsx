import { createContext, ReactNode, useContext, useState } from 'react';
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface UserType {
    id: number,
    name: string
}

interface AuthContextData {
    user: UserType | null;
    login: () => void;
    logout: () => void;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const login = () => {
        alert("Login successfully");
        setUser({ id: 1, name: 'User Demo' });
    };
    const logout = () => {
        setUser(null);
    };
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
};
export const useAuth = () => useContext(AuthContext);

