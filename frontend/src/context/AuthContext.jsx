import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(
        localStorage.getItem("token") ? { token: localStorage.getItem("token"), name: localStorage.getItem("Name") } : null
    );

    const login = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("Name", data.name);
        setUser({ token: data.token, name: data.name });
    }
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("Name");
        setUser(null);
    }
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext);