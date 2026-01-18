import React, { createContext, useContext, useState, useEffect } from 'react'
import apiClient from '../api/client'

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Vérifier l'authentification au chargement
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const token = localStorage.getItem('access_token')
        if (token) {
            try {
                const response = await apiClient.get('auth/profile/')
                setUser(response.data)
                setIsAuthenticated(true)
            } catch (error) {
                console.error('Auth check error:', error)
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
            }
        }
        setLoading(false)
    }

    const login = async (email, password) => {
        try {
            const response = await apiClient.post('auth/login/', {
                username: email,
                password: password,
            })

            const data = response.data

            localStorage.setItem('access_token', data.access)
            localStorage.setItem('refresh_token', data.refresh)

            const profileResponse = await apiClient.get('auth/profile/')
            setUser(profileResponse.data)
            setIsAuthenticated(true)
        } catch (error) {
            console.error('Login error:', error)
            let errorMessage = 'Login failed'
            if (error.response?.data?.error?.message) {
                errorMessage = error.response.data.error.message
            } else if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail
            }
            throw new Error(errorMessage)
        }
    }

    const register = async (data) => {
        try {
            const response = await apiClient.post('auth/register/', data)
            const result = response.data

            if (result.access && result.refresh) {
                localStorage.setItem('access_token', result.access)
                localStorage.setItem('refresh_token', result.refresh)

                const profileResponse = await apiClient.get('auth/profile/')
                setUser(profileResponse.data)
                setIsAuthenticated(true)
            }
        } catch (error) {
            console.error('Registration error details:', error)
            const result = error.response?.data
            let errorMessage = 'Registration failed'
            if (result) {
                // Extracting error logic follows... (kept for clarity)
                // Handle Custom Exception Handler Format
                if (result.error && result.error.details) {
                    const details = result.error.details;
                    const errors = [];

                    // If details is a list (e.g. [ 'Error 1', 'Error 2' ])
                    if (Array.isArray(details)) {
                        errors.push(...details);
                    }
                    // If details is an object (e.g. { email: [ 'Error' ] })
                    else if (typeof details === 'object') {
                        for (const [key, value] of Object.entries(details)) {
                            // Don't include the key if it's generic like 'detail' or 'non_field_errors'
                            if (key === 'detail' || key === 'non_field_errors') {
                                errors.push(`${Array.isArray(value) ? value.join(' ') : value}`);
                            } else {
                                // For field errors, just show the message, or "key: message"
                                // User wants "Cette adresse email..." not "email: Cette..."
                                // Let's just show the value which is the message.
                                errors.push(`${Array.isArray(value) ? value.join(' ') : value}`);
                            }
                        }
                    }

                    if (errors.length > 0) {
                        errorMessage = errors.join('\n');
                    } else {
                        errorMessage = result.error.message || 'Unknown error';
                    }
                }
                // Handle Standard Django Rest Framework validation errors (fallback)
                else if (typeof result === 'object') {
                    const errors = []
                    for (const [key, value] of Object.entries(result)) {
                        if (key === 'success' || key === 'error') continue; // Skip custom wrapper keys if they slipped through
                        errors.push(`${key}: ${Array.isArray(value) ? value.join(' ') : value}`)
                    }
                    if (errors.length > 0) {
                        errorMessage = errors.join(' | ')
                    } else if (result.detail) {
                        errorMessage = result.detail
                    }
                } else if (typeof result === 'string') {
                    errorMessage = result
                }
            }
            throw new Error(errorMessage)
        }
    }

    const logout = () => {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
    }

    const updateUser = (userData) => {
        setUser(userData)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, register, updateUser, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
