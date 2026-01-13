import apiClient from '../../api/client';

/**
 * Service API pour la gestion des messages de contact.
 */
export const messageService = {
    /**
     * Récupère la liste des messages
     */
    getMessages: async () => {
        const response = await apiClient.get('/contact/messages/');
        return response.data.results || response.data;
    },

    /**
     * Met à jour le statut "lu" d'un message
     */
    toggleRead: async (id, isRead) => {
        const response = await apiClient.patch(`/contact/messages/${id}/`, {
            is_read: isRead,
        });
        return response.data;
    },

    /**
     * Supprime un message
     */
    deleteMessage: async (id) => {
        await apiClient.delete(`/contact/messages/${id}/`);
    }
};
