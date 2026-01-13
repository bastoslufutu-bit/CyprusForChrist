import apiClient from '../../api/client';

/**
 * Service API pour la gestion des événements.
 */
export const eventService = {
    /**
     * Récupère la liste des événements avec filtres
     */
    getEvents: async (params = {}) => {
        const response = await apiClient.get('/admin/events/', { params });
        return response.data.results || response.data;
    },

    /**
     * Crée un nouvel événement
     */
    createEvent: async (formData) => {
        const response = await apiClient.post('/admin/events/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    /**
     * Met à jour un événement existant
     */
    updateEvent: async (id, formData) => {
        const response = await apiClient.patch(`/admin/events/${id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    /**
     * Supprime un événement
     */
    deleteEvent: async (id) => {
        await apiClient.delete(`/admin/events/${id}/`);
    }
};
