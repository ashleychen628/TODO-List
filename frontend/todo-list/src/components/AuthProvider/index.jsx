import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [userName, setUserName] = useState(localStorage.getItem("userName"));
    // Update localStorage whenever token changes
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            localStorage.setItem("userName", userName);
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
        }
    }, [token]);

    const login = (newToken, name) => {
        setToken(newToken);
        setUserName(name);
    };

    const logout = () => {
        setToken(null);
        setUserName(null);
    };

    return (
        <AuthContext.Provider value={{ token, userName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
