import apiClient from '../../api/client';

/**
 * Service API pour la gestion de la galerie photos.
 */
export const galleryService = {
    /**
     * Récupère les items de la galerie avec filtres
     */
    getGalleryItems: async (params = {}) => {
        const response = await apiClient.get('/admin/gallery/', { params });
        return response.data.results || response.data;
    },

    /**
     * Upload groupé de photos
     */
    bulkUpload: async (formData) => {
        const response = await apiClient.post('/admin/gallery/bulk_upload/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    /**
     * Met à jour une photo existante
     */
    updateItem: async (id, formData) => {
        const response = await apiClient.patch(`/admin/gallery/${id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    /**
     * Supprime une photo
     */
    deleteItem: async (id) => {
        await apiClient.delete(`/admin/gallery/${id}/`);
    }
};
