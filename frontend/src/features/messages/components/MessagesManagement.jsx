import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaSearch, FaTimes, FaEye } from 'react-icons/fa'
import { messageService } from '../api'

const MessagesManagement = () => {
    const [messages, setMessages] = useState([])
    const [filteredMessages, setFilteredMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all') // 'all', 'read', 'unread'
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        loadMessages()
    }, [])

    useEffect(() => {
        filterMessages()
    }, [messages, searchTerm, filterStatus])

    const loadMessages = async () => {
        try {
            const data = await messageService.getMessages()
            setMessages(data)
        } catch (error) {
            console.error('Error loading messages:', error)
            alert('Erreur lors du chargement des messages')
        } finally {
            setLoading(false)
        }
    }

    const filterMessages = () => {
        let filtered = messages

        // Filter by status
        if (filterStatus === 'read') {
            filtered = filtered.filter(msg => msg.is_read)
        } else if (filterStatus === 'unread') {
            filtered = filtered.filter(msg => !msg.is_read)
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(msg =>
                msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.message.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        setFilteredMessages(filtered)
    }

    const handleViewMessage = (message) => {
        setSelectedMessage(message)
        setShowModal(true)

        // Mark as read when viewing
        if (!message.is_read) {
            handleToggleRead(message.id, true)
        }
    }

    const handleToggleRead = async (id, isRead) => {
        try {
            await messageService.toggleRead(id, isRead)
            setMessages(prev => prev.map(msg =>
                msg.id === id ? { ...msg, is_read: isRead } : msg
            ))
        } catch (error) {
            console.error('Error updating message status:', error)
        }
    }

    const handleDelete = async (id) => {
        if (!id) return alert('ID du message manquant')
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return

        try {
            await messageService.deleteMessage(id)
            setMessages(prev => prev.filter(msg => msg.id !== id))
            alert('Message supprimé avec succès !')
        } catch (error) {
            console.error('Error deleting message:', error)
            alert('Erreur lors de la suppression')
        }
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
        return new Date(dateString).toLocaleDateString('fr-FR', options)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bordeaux"></div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-bordeaux to-purple-900 p-6 text-white">
                    <h2 className="text-2xl font-playfair font-bold">Messages de Contact</h2>
                    <p className="opacity-80">Gérez les messages reçus via le formulaire de contact</p>
                </div>

                {/* Filters and Search */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        {/* Search */}
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom, email, sujet ou message..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux/20 focus:border-bordeaux outline-none"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'all'
                                    ? 'bg-bordeaux text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Tous ({messages.length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('unread')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'unread'
                                    ? 'bg-bordeaux text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Non lus ({messages.filter(m => !m.is_read).length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('read')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'read'
                                    ? 'bg-bordeaux text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Lus ({messages.filter(m => m.is_read).length})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages List */}
                <div className="p-6">
                    {filteredMessages.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <FaEnvelope className="mx-auto text-6xl mb-4 opacity-20" />
                            <p className="text-lg">Aucun message trouvé</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredMessages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`border rounded-xl p-4 transition-all hover:shadow-md ${message.is_read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Status Icon */}
                                        <div className="flex-shrink-0 mt-1">
                                            {message.is_read ? (
                                                <FaEnvelopeOpen className="text-gray-400 text-xl" />
                                            ) : (
                                                <FaEnvelope className="text-blue-500 text-xl" />
                                            )}
                                        </div>

                                        {/* Message Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-bordeaux">{message.subject}</h3>
                                                    <p className="text-sm text-gray-600">
                                                        De: <span className="font-medium">{message.name}</span> ({message.email})
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {message.message.length > 150
                                                            ? `${message.message.substring(0, 150)}...`
                                                            : message.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-2">{formatDate(message.created_at)}</p>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2 flex-shrink-0">
                                                    <button
                                                        onClick={() => handleViewMessage(message)}
                                                        className="p-2.5 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all shadow-sm border border-blue-200"
                                                        title="Voir le message complet"
                                                    >
                                                        <FaEye className="text-lg" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleRead(message.id, !message.is_read)}
                                                        className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all shadow-sm border border-blue-200"
                                                        title={message.is_read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                                                    >
                                                        {message.is_read ? <FaEnvelope className="text-lg" /> : <FaEnvelopeOpen className="text-lg" />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(message.id)}
                                                        className="p-2.5 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all shadow-sm border border-red-200"
                                                        title="Supprimer"
                                                    >
                                                        <FaTrash className="text-lg" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )
                    }
                </div>
            </div>

            {/* Message Detail Modal */}
            {showModal && selectedMessage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-gradient-to-r from-bordeaux to-purple-900 p-6 text-white flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-playfair font-bold">{selectedMessage.subject}</h3>
                                <p className="opacity-80 text-sm mt-1">{formatDate(selectedMessage.created_at)}</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <FaTimes className="text-xl" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">De:</label>
                                <p className="text-lg font-medium">{selectedMessage.name}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Email:</label>
                                <p className="text-lg">
                                    <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                                        {selectedMessage.email}
                                    </a>
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Message:</label>
                                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed mt-2">
                                    {selectedMessage.message}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex gap-3">
                                <button
                                    onClick={() => {
                                        handleToggleRead(selectedMessage.id, !selectedMessage.is_read)
                                        setShowModal(false)
                                    }}
                                    className="flex-1 bg-gold text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                                >
                                    Marquer comme {selectedMessage.is_read ? 'non lu' : 'lu'}
                                </button>
                                <button
                                    onClick={() => {
                                        handleDelete(selectedMessage.id)
                                        setShowModal(false)
                                    }}
                                    className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default MessagesManagement
