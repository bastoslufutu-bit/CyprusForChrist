import apiClient from '../../api/client';

/**
 * Service API pour la gestion des dons.
 */
export const donationService = {
    /**
     * Récupère la liste des dons avec filtres
     */
    getDonations: async (params = {}) => {
        const response = await apiClient.get('/admin/donations/', { params });
        return response.data.results || response.data;
    },

    /**
     * Exporte les dons au format CSV
     */
    exportCSV: async () => {
        const response = await apiClient.get('/admin/donations/export_csv/', {
            responseType: 'blob'
        });
        return response.data;
    }
};
