import apiClient from '../../api/client';

/**
 * Service API pour la gestion des informations de contact de l'église.
 */
export const contactService = {
    /**
     * Récupère les informations de contact
     */
    getContactInfo: async () => {
        const response = await apiClient.get('/contact/info/');
        return response.data;
    },

    /**
     * Met à jour les informations de contact
     */
    updateContactInfo: async (formData) => {
        const response = await apiClient.put('/contact/info/', formData);
        return response.data;
    }
};
