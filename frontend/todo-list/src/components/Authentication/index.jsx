import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const Authentication = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));

    // Update localStorage whenever token changes
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    const login = (newToken) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
