import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCalendarAlt, FaMapMarkerAlt, FaExpand, FaTimes } from 'react-icons/fa'
import apiClient from '../api/client'

import { useLanguage } from '../context/LanguageContext'

const Gallery = () => {
    const { t, language } = useLanguage()
    const [events, setEvents] = useState([])
    const [galleryItems, setGalleryItems] = useState([])
    const [selectedImage, setSelectedImage] = useState(null)
    const [loading, setLoading] = useState(true)

    const getImageUrl = (url) => {
        if (!url) return null;
        try {
            if (url.toString().startsWith('http')) return url;
            return `${apiClient.defaults.baseURL.replace('/api/', '')}${url}`;
        } catch (e) {
            return null;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsRes, galleryRes] = await Promise.all([
                    apiClient.get('about/events/'),
                    apiClient.get('about/gallery/')
                ]);

                setEvents(eventsRes.data.results || eventsRes.data);
                setGalleryItems(galleryRes.data.results || galleryRes.data);
            } catch (error) {
                console.error("Erreur chargement galerie:", error)
                setEvents([])
                setGalleryItems([])
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <header className="relative py-24 bg-compassion-dark text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-compassion-purple/90 to-black/90 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80')] bg-cover bg-center opacity-40 filter blur-sm" />

                <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-playfair font-bold mb-6"
                    >
                        {t('gallery.title')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/80 max-w-2xl mx-auto"
                    >
                        {t('gallery.subtitle')}
                    </motion.p>
                </div>
            </header>

            {/* Featured Events Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 mb-12"
                    >
                        <div className="h-1 w-12 bg-gold" />
                        <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wider">{t('gallery.featuredEvents')}</h2>
                    </motion.div>

                    {events.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 italic">
                            {t('gallery.noEvents')}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {events.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group relative overflow-hidden rounded-2xl shadow-xl h-[400px]"
                                >
                                    <img
                                        src={getImageUrl(event.image) || 'https://via.placeholder.com/800x600?text=No+Image'}
                                        alt={event.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:via-black/60 transition-colors" />

                                    <div className="absolute bottom-0 left-0 p-8 w-full">
                                        <div className="bg-gold text-black text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-2 mb-3">
                                            <FaCalendarAlt />
                                            {new Date(event.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-2">{event.title}</h3>
                                        <p className="text-white/80 line-clamp-2 mb-4">{event.description}</p>
                                        <div className="flex items-center text-white/70 text-sm">
                                            <FaMapMarkerAlt className="mr-2 text-gold" />
                                            {event.location || (language === 'fr' ? "Lieu à confirmer" : "Location to be confirmed")}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Photo Gallery Masonry */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 mb-12"
                    >
                        <div className="h-1 w-12 bg-compassion-purple" />
                        <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wider">{t('gallery.churchLife')}</h2>
                    </motion.div>

                    {galleryItems.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 italic">
                            {t('gallery.noPhotos')}
                        </div>
                    ) : (
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                            {galleryItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                    className="break-inside-avoid relative group cursor-pointer rounded-xl overflow-hidden shadow-lg"
                                    onClick={() => setSelectedImage(item)}
                                >
                                    <img
                                        src={getImageUrl(item.image)}
                                        alt={item.title || "Photo église"}
                                        className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-75"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <FaExpand className="text-white text-3xl drop-shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                                    </div>
                                    {(item.title || item.caption) && (
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                                            <h4 className="font-bold">{item.title}</h4>
                                            <p className="text-xs opacity-80">{item.caption}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <FaTimes className="text-4xl" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="relative max-w-5xl max-h-[90vh] rounded-lg overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={getImageUrl(selectedImage.image)}
                                alt={selectedImage.title}
                                className="max-w-full max-h-[85vh] object-contain shadow-2xl"
                            />
                            {(selectedImage.title || selectedImage.caption) && (
                                <div className="bg-black/80 text-white p-4 text-center mt-2 rounded-b-lg backdrop-blur-sm">
                                    <h3 className="text-xl font-bold">{selectedImage.title}</h3>
                                    <p className="text-gray-300 mt-1">{selectedImage.caption}</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Gallery
