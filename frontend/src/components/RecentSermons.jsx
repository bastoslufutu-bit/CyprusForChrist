import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaPlay, FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import { formatPastorName, formatCategory } from '../utils/stringUtils'
import apiClient from '../api/client'

const RecentSermons = () => {
    const { t, language } = useLanguage()
    const [sermons, setSermons] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecentSermons = async () => {
            try {
                const response = await apiClient.get('sermons/')
                const data = response.data
                const sermonList = Array.isArray(data) ? data : (data.results || [])

                // Take only the first 3 (most recent)
                const recent = sermonList.slice(0, 3).map(s => ({
                    id: s.id,
                    title: s.title,
                    preacher: formatPastorName(s.pastor_name),
                    date: s.created_at,
                    thumbnail: s.thumbnail || 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    category: s.category ? formatCategory(s.category, t) : t('sermons.filters.other')
                }))
                setSermons(recent)
            } catch (error) {
                console.error('Error fetching recent sermons:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchRecentSermons()
    }, [t])

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    if (loading) return null // Hide if loading or handle with skeleton

    if (sermons.length === 0) return null

    return (
        <section className="py-24 bg-soft-gray">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-gold font-bold tracking-widest uppercase text-xs mb-4 block">{t('recent_sermons.label')}</span>
                        <h2 className="text-4xl md:text-5xl font-sans font-extrabold text-gray-900 mb-4">
                            {t('recent_sermons.title_prefix')} <span className="text-gradient">{t('recent_sermons.title_suffix')}</span>
                        </h2>
                        <p className="text-gray-500 max-w-xl">{t('recent_sermons.desc')}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            to="/sermons"
                            className="inline-flex items-center bg-white text-bordeaux border border-gold/20 px-8 py-3 rounded-full font-bold hover:bg-gold hover:text-white transition-all group shadow-sm"
                        >
                            {t('recent_sermons.explore')}
                            <FaArrowRight className="ml-3 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {sermons.map((sermon, index) => (
                        <motion.div
                            key={sermon.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 group border border-gray-100"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={sermon.thumbnail}
                                    alt={sermon.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 text-white transform scale-90 group-hover:scale-100 transition-transform">
                                        <FaPlay className="h-6 w-6" />
                                    </div>
                                </div>
                                <div className="absolute top-6 left-6">
                                    <span className="bg-white/90 backdrop-blur-sm text-bordeaux px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                        {sermon.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight group-hover:text-gold transition-colors font-sans">
                                    {sermon.title}
                                </h3>
                                <div className="flex flex-col space-y-3 mb-8">
                                    <div className="flex items-center text-gray-500 font-medium">
                                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold mr-3">
                                            <FaUser className="h-3 w-3" />
                                        </div>
                                        <span>{sermon.preacher}</span>
                                    </div>
                                    <div className="flex items-center text-gray-400 text-sm font-sans">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mr-3 text-gray-400">
                                            <FaCalendarAlt className="h-3 w-3" />
                                        </div>
                                        <span>{formatDate(sermon.date)}</span>
                                    </div>
                                </div>
                                <Link
                                    to="/sermons"
                                    className="flex items-center justify-center w-full py-4 rounded-2xl font-extrabold border-2 border-bordeaux text-bordeaux hover:bg-bordeaux hover:text-white transition-all shadow-sm font-sans"
                                >
                                    {t('sermons.watch_message')}
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section >
    )
}

export default RecentSermons
