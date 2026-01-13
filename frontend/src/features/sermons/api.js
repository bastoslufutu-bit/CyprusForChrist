import apiClient from '../../api/client';

/**
 * Service API pour la gestion des sermons.
 */
export const sermonService = {
    /**
     * Récupère la liste des sermons avec filtres optionnels
     */
    getSermons: async (params = {}) => {
        const response = await apiClient.get('/admin/sermons/', { params });
        return response.data.results || response.data;
    },

    /**
     * Crée un nouveau sermon (gestion Multipart/FormData pour les fichiers)
     */
    createSermon: async (formData) => {
        const response = await apiClient.post('/admin/sermons/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    /**
     * Met à jour un sermon existant
     */
    updateSermon: async (id, formData) => {
        const response = await apiClient.put(`/admin/sermons/${id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    /**
     * Supprime un sermon
     */
    deleteSermon: async (id) => {
        await apiClient.delete(`/admin/sermons/${id}/`);
    }
};
