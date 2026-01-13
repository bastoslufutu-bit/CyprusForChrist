import apiClient from '../../api/client';

/**
 * Service API pour la gestion des demandes de prière.
 */
export const prayerService = {
    /**
     * Récupère la liste des prières avec filtres
     */
    getPrayers: async (params = {}) => {
        const response = await apiClient.get('/admin/prayers/', { params });
        return response.data.results || response.data;
    },

    /**
     * Met à jour le statut d'une prière
     */
    updateStatus: async (id, status) => {
        const response = await apiClient.patch(`/admin/prayers/${id}/`, { status });
        return response.data;
    }
};
