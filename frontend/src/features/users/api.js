import apiClient from '../../api/client';

/**
 * Service API pour la gestion des utilisateurs et rôles.
 */
export const userService = {
    /**
     * Récupère la liste des utilisateurs avec filtres
     */
    getUsers: async (params = {}) => {
        const response = await apiClient.get('/admin/users/', { params });
        return response.data.results || response.data;
    },

    /**
     * Change le rôle d'un utilisateur
     */
    changeRole: async (userId, role) => {
        const response = await apiClient.patch(`/admin/users/${userId}/change_role/`, { role });
        return response.data;
    },

    /**
     * Réinitialise le mot de passe d'un utilisateur
     */
    resetPassword: async (userId, password = undefined) => {
        const response = await apiClient.post(`/admin/users/${userId}/reset_password/`, { password });
        return response.data;
    },

    /**
     * Active/Désactive un utilisateur
     */
    toggleActive: async (userId) => {
        const response = await apiClient.post(`/admin/users/${userId}/toggle_active/`);
        return response.data;
    },

    /**
     * Supprime un utilisateur
     */
    deleteUser: async (userId) => {
        await apiClient.delete(`/admin/users/${userId}/`);
    },

    /**
     * Crée un nouveau pasteur (admin only)
     */
    createPastor: async (userData) => {
        const response = await apiClient.post('/admin/users/create_pastor/', userData);
        return response.data;
    }
};
