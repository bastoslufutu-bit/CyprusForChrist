import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaSave, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp, FaInstagram, FaYoutube, FaFacebook } from 'react-icons/fa'
import { contactService } from '../api'

const ContactManagement = () => {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        address: '',
        service_times_sunday: '',
        service_times_wednesday: '',
        whatsapp: '',
        instagram: '',
        youtube: '',
        facebook: ''
    })

    useEffect(() => {
        loadContactInfo()
    }, [])

    const loadContactInfo = async () => {
        try {
            const data = await contactService.getContactInfo()
            setFormData(data)
        } catch (error) {
            console.error('Error fetching contact info:', error)
            setMessage({ type: 'error', text: 'Erreur lors du chargement des informations.' })
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setMessage({ type: '', text: '' })
        try {
            await contactService.updateContactInfo(formData)
            setMessage({ type: 'success', text: 'Informations mises à jour avec succès !' })
        } catch (error) {
            console.error('Error updating contact info:', error)
            setMessage({ type: 'error', text: 'Erreur lors de la mise à jour.' })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bordeaux"></div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-bordeaux to-purple-900 p-6 text-white">
                    <h2 className="text-2xl font-playfair font-bold">Gestion des Informations de Contact</h2>
                    <p className="opacity-80">Modifiez les coordonnées et les liens sociaux affichés sur le site</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {message.text && (
                        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Informations de Base */}
                    <section>
                        <h3 className="text-lg font-bold text-bordeaux mb-4 flex items-center gap-2">
                            <FaPhone className="text-gold" /> Coordonnées de Base
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-bordeaux/20 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contact</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-bordeaux/20 outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse Physique</label>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-bordeaux/20 outline-none"
                                        rows="2"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Horaires des Services */}
                    <section>
                        <h3 className="text-lg font-bold text-bordeaux mb-4 flex items-center gap-2">
                            <FaClock className="text-gold" /> Horaires des Services
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Culte du Dimanche</label>
                                <input
                                    type="text"
                                    name="service_times_sunday"
                                    value={formData.service_times_sunday}
                                    onChange={handleChange}
                                    placeholder="ex: 10:00 - 12:30"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-bordeaux/20 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Étude Biblique (Mercredi)</label>
                                <input
                                    type="text"
                                    name="service_times_wednesday"
                                    value={formData.service_times_wednesday}
                                    onChange={handleChange}
                                    placeholder="ex: 18:30 - 20:00"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-bordeaux/20 outline-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Réseaux Sociaux */}
                    <section>
                        <h3 className="text-lg font-bold text-bordeaux mb-4 flex items-center gap-2">
                            <FaWhatsapp className="text-gold" /> Réseaux Sociaux & Liens
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <FaWhatsapp className="absolute left-3 top-3 text-green-500" />
                                <input
                                    type="text"
                                    name="whatsapp"
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                    placeholder="Numéro WhatsApp"
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-bordeaux/20 outline-none"
                                />
                            </div>
                            <div className="relative">
                                <FaInstagram className="absolute left-3 top-3 text-pink-500" />
                                <input
                                    type="text"
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    placeholder="Lien Instagram"
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-bordeaux/20 outline-none"
                                />
                            </div>
                            <div className="relative">
                                <FaYoutube className="absolute left-3 top-3 text-red-600" />
                                <input
                                    type="text"
                                    name="youtube"
                                    value={formData.youtube}
                                    onChange={handleChange}
                                    placeholder="Lien YouTube"
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-bordeaux/20 outline-none"
                                />
                            </div>
                            <div className="relative">
                                <FaFacebook className="absolute left-3 top-3 text-blue-600" />
                                <input
                                    type="text"
                                    name="facebook"
                                    value={formData.facebook}
                                    onChange={handleChange}
                                    placeholder="Lien Facebook"
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-bordeaux/20 outline-none"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-gradient-to-r from-gold to-lightGold text-white px-10 py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            <FaSave />
                            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ContactManagement
