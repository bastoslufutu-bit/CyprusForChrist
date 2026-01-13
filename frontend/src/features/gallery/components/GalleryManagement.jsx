import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa'
import { galleryService } from '../api'

const GalleryManagement = () => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showFormModal, setShowFormModal] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        caption: ''
    })
    const [imageFiles, setImageFiles] = useState([])

    const loadItems = async () => {
        setLoading(true)
        try {
            const params = {}
            if (searchTerm) params.search = searchTerm

            const data = await galleryService.getGalleryItems(params)
            setItems(data)
        } catch (error) {
            console.error('Error fetching gallery items:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadItems()
    }, [searchTerm])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!editingItem && imageFiles.length > 7) {
            alert('Maximum 7 photos autorisées à la fois.')
            return
        }

        const data = new FormData()
        data.append('title', formData.title)
        data.append('caption', formData.caption)

        if (editingItem) {
            if (imageFiles[0]) {
                data.append('image', imageFiles[0])
            }
        } else {
            imageFiles.forEach(file => {
                data.append('images', file)
            })
        }

        try {
            if (editingItem) {
                await galleryService.updateItem(editingItem.id, data)
            } else {
                await galleryService.bulkUpload(data)
            }

            loadItems()
            setShowFormModal(false)
            resetForm()
            alert(editingItem ? 'Photo modifiée !' : `${imageFiles.length} photo(s) ajoutée(s) !`)
        } catch (error) {
            console.error('Error saving gallery item:', error)
            alert('Erreur lors de la sauvegarde')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Voulez-vous vraiment supprimer cette photo ?')) return

        try {
            await galleryService.deleteItem(id)
            loadItems()
            alert('Photo supprimée !')
        } catch (error) {
            console.error('Error deleting item:', error)
            alert('Erreur lors de la suppression')
        }
    }

    const resetForm = () => {
        setFormData({ title: '', caption: '' })
        setImageFiles([])
        setEditingItem(null)
    }

    const openEditModal = (item) => {
        setEditingItem(item)
        setFormData({ title: item.title, caption: item.caption })
        setShowFormModal(true)
    }

    if (loading && items.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bordeaux"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une photo..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-bordeaux/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => { resetForm(); setShowFormModal(true) }}
                    className="flex items-center gap-2 px-6 py-3 bg-bordeaux text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                    <FaPlus /> Ajouter Photos
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all relative aspect-square"
                    >
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                            <h3 className="text-white font-bold mb-1">{item.title}</h3>
                            <p className="text-gray-300 text-xs mb-4 line-clamp-2">{item.caption}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(item)}
                                    className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg backdrop-blur-sm transition-all"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-all"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal Form */}
            <AnimatePresence>
                {showFormModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl w-full max-w-lg"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold">{editingItem ? 'Modifier la photo' : 'Ajouter des photos'}</h2>
                                <button onClick={() => setShowFormModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Titre</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-bordeaux/20"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Légende</label>
                                        <textarea
                                            rows="2"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-bordeaux/20"
                                            value={formData.caption}
                                            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            {editingItem ? 'Remplacer l\'image' : 'Sélectionner des images (max 7)'}
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple={!editingItem}
                                            onChange={(e) => setImageFiles(Array.from(e.target.files))}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-bordeaux/10 file:text-bordeaux hover:file:bg-bordeaux/20"
                                        />
                                        {!editingItem && imageFiles.length > 0 && (
                                            <p className="mt-2 text-xs text-bordeaux font-bold">
                                                {imageFiles.length} fichier(s) sélectionné(s)
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
                                    <button
                                        type="button"
                                        onClick={() => setShowFormModal(false)}
                                        className="px-6 py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-bordeaux text-white rounded-xl font-bold hover:shadow-lg transition-all"
                                    >
                                        {editingItem ? 'Enregistrer' : 'Téléverser'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {items.length === 0 && !loading && (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                    <FaImage className="mx-auto text-6xl text-gray-200 mb-4" />
                    <p className="text-gray-500">La galerie est vide</p>
                </div>
            )}
        </div>
    )
}

export default GalleryManagement
