import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaFilter, FaPray, FaCheckCircle, FaClock, FaHourglassHalf } from 'react-icons/fa'
import { prayerService } from '../api'

const PrayersManagement = () => {
    const [prayers, setPrayers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    const statuses = [
        { value: '', label: 'Tous les statuts' },
        { value: 'PENDING', label: 'En attente' },
        { value: 'PRAYING', label: 'En prière' },
        { value: 'ANSWERED', label: 'Exaucée' }
    ]

    const loadPrayers = async () => {
        setLoading(true)
        try {
            const params = {}
            if (searchTerm) params.search = searchTerm
            if (statusFilter) params.status = statusFilter

            const data = await prayerService.getPrayers(params)
            setPrayers(data)
        } catch (error) {
            console.error('Error fetching prayers:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPrayers()
    }, [searchTerm, statusFilter])

    const handleStatusChange = async (id, newStatus) => {
        try {
            await prayerService.updateStatus(id, newStatus)
            loadPrayers()
            alert('Statut modifié !')
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Erreur lors de la modification')
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': return <FaClock className="text-yellow-500" />
            case 'PRAYING': return <FaHourglassHalf className="text-blue-500" />
            case 'ANSWERED': return <FaCheckCircle className="text-green-500" />
            default: return <FaPray />
        }
    }

    const getStatusLabel = (status) => {
        const s = statuses.find(st => st.value === status)
        return s ? s.label : status
    }

    if (loading && prayers.length === 0) {
        return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bordeaux"></div></div>
    }

    return (
        <div>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                        />
                    </div>
                    <div className="relative w-full md:w-auto">
                        <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full md:w-[200px] pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none appearance-none bg-white"
                        >
                            {statuses.map(st => (
                                <option key={st.value} value={st.value}>{st.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {prayers.map((prayer) => (
                    <motion.div
                        key={prayer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-md p-6 border-l-4 border-gold hover:shadow-xl transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-bordeaux">{prayer.member_name}</h3>
                                <p className="text-gray-500 text-sm">{new Date(prayer.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                                {getStatusIcon(prayer.status)}
                                <span className="text-xs font-bold uppercase tracking-wider">{getStatusLabel(prayer.status)}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-gray-700 italic">"{prayer.request_text}"</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {statuses.filter(s => s.value).map(st => (
                                <button
                                    key={st.value}
                                    onClick={() => handleStatusChange(prayer.id, st.value)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${prayer.status === st.value
                                        ? 'bg-bordeaux text-white shadow-md'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {st.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {prayers.length === 0 && !loading && (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                    <FaPray className="mx-auto text-6xl text-gray-200 mb-4" />
                    <p className="text-gray-500">Aucune demande de prière trouvée</p>
                </div>
            )}
        </div>
    )
}

export default PrayersManagement
