import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaPlus, FaEdit, FaTrash, FaFilter, FaVideo, FaPlay } from 'react-icons/fa'
import { useAuth } from '../../../context/AuthContext'
import { sermonService } from '../api'

const SermonsManagement = () => {
    const [sermons, setSermons] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [showFormModal, setShowFormModal] = useState(false)
    const [editingSermon, setEditingSermon] = useState(null)
    const { user } = useAuth()
    const isAdmin = user?.role === 'ADMIN'
    const [formData, setFormData] = useState({
        title: '',
        speaker: '',
        date: '',
        category: 'MESSAGE',
        description: '',
        video_url: '',
        audio_url: '',
        thumbnail: ''
    })
    const [coverImageFile, setCoverImageFile] = useState(null)
    const [pdfFile, setPdfFile] = useState(null)

    const categories = [
        { value: '', label: 'Toutes catégories' },
        { value: 'MESSAGE', label: 'Message' },
        { value: 'TEACHING', label: 'Enseignement' },
        { value: 'WORSHIP', label: 'Louange' },
        { value: 'TESTIMONY', label: 'Témoignage' }
    ]

    const loadSermons = async () => {
        setLoading(true)
        try {
            const params = {}
            if (searchTerm) params.search = searchTerm
            if (categoryFilter) params.category = categoryFilter

            const data = await sermonService.getSermons(params)
            setSermons(data)
        } catch (error) {
            console.error('Error fetching sermons:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSermons()
    }, [searchTerm, categoryFilter])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const data = new FormData()
            data.append('title', formData.title)
            data.append('description', formData.description || '')
            data.append('category', formData.category)

            if (formData.video_url) data.append('youtube_url', formData.video_url)
            if (formData.audio_url) data.append('audio_url', formData.audio_url)
            if (coverImageFile) data.append('cover_image', coverImageFile)
            if (pdfFile) data.append('pdf_file', pdfFile)

            if (editingSermon) {
                await sermonService.updateSermon(editingSermon.id, data)
                alert('Sermon modifié !')
            } else {
                await sermonService.createSermon(data)
                alert('Sermon créé !')
            }

            setShowFormModal(false)
            setEditingSermon(null)
            resetForm()
            loadSermons()
        } catch (error) {
            console.error('Error saving sermon:', error)
            alert('Erreur lors de l\'enregistrement')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Voulez-vous vraiment supprimer ce sermon ?')) return

        try {
            await sermonService.deleteSermon(id)
            loadSermons()
            alert('Sermon supprimé !')
        } catch (error) {
            console.error('Error deleting sermon:', error)
            alert('Erreur lors de la suppression')
        }
    }

    const resetForm = () => {
        setFormData({
            title: '',
            speaker: '',
            date: '',
            category: 'MESSAGE',
            description: '',
            video_url: '',
            audio_url: '',
            thumbnail: ''
        })
        setCoverImageFile(null)
        setPdfFile(null)
    }

    const handleEdit = (sermon) => {
        setEditingSermon(sermon)
        setFormData({
            title: sermon.title,
            speaker: sermon.pastor_name || '',
            date: sermon.created_at?.split('T')[0] || '',
            category: sermon.category,
            description: sermon.description || '',
            video_url: sermon.youtube_url || '',
            audio_url: sermon.audio_url || '',
            thumbnail: ''
        })
        setShowFormModal(true)
    }

    if (loading && sermons.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bordeaux"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm">
                <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un sermon..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-bordeaux/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <select
                        className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-bordeaux/20"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                    {isAdmin && (
                        <button
                            onClick={() => {
                                setEditingSermon(null)
                                resetForm()
                                setShowFormModal(true)
                            }}
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-gold to-lightGold text-white rounded-lg font-bold hover:shadow-lg transition-all"
                        >
                            <FaPlus /> Nouveau
                        </button>
                    )}
                </div>
            </div>

            {/* Sermons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sermons.map((sermon) => (
                    <motion.div
                        key={sermon.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
                    >
                        <div className="relative h-48 bg-gray-200">
                            {sermon.cover_image ? (
                                <img src={sermon.cover_image} alt={sermon.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <FaVideo size={48} />
                                </div>
                            )}
                            <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 bg-bordeaux text-white text-xs font-bold rounded">
                                    {sermon.category}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 flex-1">
                            <h3 className="font-bold text-lg mb-1 line-clamp-1">{sermon.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                {sermon.description || 'Aucune description'}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                {isAdmin && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(sermon)}
                                            className="p-2.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-all border border-orange-200"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(sermon.id)}
                                            className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all border border-red-200"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                )}
                                {sermon.youtube_url && (
                                    <a
                                        href={sermon.youtube_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all border border-blue-200"
                                    >
                                        <FaPlay />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Form Modal */}
            {showFormModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-bold">
                                {editingSermon ? 'Modifier le Sermon' : 'Ajouter un Sermon'}
                            </h2>
                            <button
                                onClick={() => setShowFormModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FaSearch /> {/* Reusing an icon search as close because it's available */}
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-bordeaux/20"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                    <select
                                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-bordeaux/20"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.filter(c => c.value).map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-bordeaux/20"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">URL YouTube</label>
                                    <input
                                        type="url"
                                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-bordeaux/20"
                                        value={formData.video_url}
                                        onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Audio (MP3)</label>
                                    <input
                                        type="url"
                                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-bordeaux/20"
                                        value={formData.audio_url}
                                        onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image de couverture</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-bordeaux/10 file:text-bordeaux hover:file:bg-bordeaux/20"
                                        onChange={(e) => setCoverImageFile(e.target.files[0])}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fichier PDF (facultatif)</label>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                                        onChange={(e) => setPdfFile(e.target.files[0])}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowFormModal(false)}
                                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-gold to-lightGold text-white rounded-xl font-bold hover:shadow-lg transition-all"
                                >
                                    {editingSermon ? 'Enregistrer' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default SermonsManagement
