import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaHistory, FaCalendarCheck } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import apiClient from '../api/client'

const Events = () => {
    const { t, language } = useLanguage()
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [view, setView] = useState('upcoming') // 'upcoming' or 'archive'
    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true)
            try {
                const isArchive = view === 'archive'
                const response = await apiClient.get(`about/events/?archive=${isArchive}`)
                const data = response.data
                const eventList = Array.isArray(data) ? data : (data.results || [])
                setEvents(eventList)
            } catch (error) {
                console.error("Error fetching events", error)
            } finally {
                setLoading(false)
            }
        }
        fetchEvents()
    }, [view])

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const locale = language === 'fr' ? 'fr-FR' : 'en-US'
        return date.toLocaleDateString(locale, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-bordeaux mb-4">{t('home.events.title')}</h1>
                    <p className="text-gray-600">{t('home.events.subtitle')}</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white p-1 rounded-full shadow-md inline-flex">
                        <button
                            onClick={() => setView('upcoming')}
                            className={`px-8 py-3 rounded-full font-medium transition-all ${view === 'upcoming'
                                ? 'bg-gradient-to-r from-gold to-lightGold text-white shadow'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <FaCalendarCheck />
                                {t('home.events.upcoming')}
                            </div>
                        </button>
                        <button
                            onClick={() => setView('archive')}
                            className={`px-8 py-3 rounded-full font-medium transition-all ${view === 'archive'
                                ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <FaHistory />
                                {t('home.events.archive')}
                            </div>
                        </button>
                    </div>
                </div>

                {/* List */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
                        <p className="text-gray-500">{t('home.events.loading')}</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.length > 0 ? (
                            events.map(event => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${view === 'archive' ? 'opacity-90 grayscale hover:grayscale-0 transition-all' : ''
                                        }`}
                                >
                                    <div className="relative h-48">
                                        <img
                                            src={event.image || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                        />
                                        {view === 'archive' && (
                                            <div className="absolute top-4 right-4 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                {t('home.events.ended')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h3>
                                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center">
                                                <FaCalendarAlt className="w-4 h-4 text-gold mr-2" />
                                                {formatDate(event.date)}
                                            </div>
                                            <div className="flex items-center">
                                                <FaClock className="w-4 h-4 text-gold mr-2" />
                                                {event.time ? event.time.substring(0, 5) : 'ND'}
                                            </div>
                                            <div className="flex items-center">
                                                <FaMapMarkerAlt className="w-4 h-4 text-gold mr-2" />
                                                {event.location}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 line-clamp-3">{event.description}</p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-white rounded-2xl">
                                <p className="text-gray-500">{t('home.events.no_events')}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Events
