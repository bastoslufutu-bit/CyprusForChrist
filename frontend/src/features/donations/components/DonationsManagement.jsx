import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaFilter, FaDownload, FaHandHoldingUsd, FaCheckCircle } from 'react-icons/fa'
import { donationService } from '../api'

const DonationsManagement = () => {
    const [donations, setDonations] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [stats, setStats] = useState({ total: 0, count: 0, thisMonth: 0 })

    const loadDonations = async () => {
        setLoading(true)
        try {
            const params = {}
            if (searchTerm) params.search = searchTerm

            const donationsList = await donationService.getDonations(params)
            setDonations(donationsList)

            // Calculate stats
            const total = donationsList.reduce((sum, d) => sum + parseFloat(d.amount), 0)
            const thisMonth = donationsList.filter(d => {
                const donationDate = new Date(d.created_at)
                const now = new Date()
                return donationDate.getMonth() === now.getMonth() && donationDate.getFullYear() === now.getFullYear()
            }).reduce((sum, d) => sum + parseFloat(d.amount), 0)

            setStats({ total, count: donationsList.length, thisMonth })
        } catch (error) {
            console.error('Error fetching donations:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadDonations()
    }, [searchTerm])

    const handleExportCSV = async () => {
        try {
            const blob = await donationService.exportCSV()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'donations.csv'
            a.click()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error exporting CSV:', error)
            alert('Erreur lors de l\'exportation CSV')
        }
    }

    if (loading && donations.length === 0) {
        return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bordeaux"></div></div>
    }

    return (
        <div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Total Dons</p>
                            <p className="text-3xl font-bold mt-2">{stats.total.toFixed(2)} €</p>
                        </div>
                        <FaHandHoldingUsd className="text-4xl opacity-50" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Nombre de Dons</p>
                            <p className="text-3xl font-bold mt-2">{stats.count}</p>
                        </div>
                        <FaCheckCircle className="text-4xl opacity-50" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Ce Mois</p>
                            <p className="text-3xl font-bold mt-2">{stats.thisMonth.toFixed(2)} €</p>
                        </div>
                        <FaHandHoldingUsd className="text-4xl opacity-50" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par donateur ou email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-bordeaux text-white rounded-lg hover:bg-opacity-90 transition-all font-bold"
                    >
                        <FaDownload /> Exporter CSV
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-gray-100">
                                <th className="py-4 px-4 font-bold text-gray-600">Donateur</th>
                                <th className="py-4 px-4 font-bold text-gray-600">Email</th>
                                <th className="py-4 px-4 font-bold text-gray-600">Montant</th>
                                <th className="py-4 px-4 font-bold text-gray-600">Date</th>
                                <th className="py-4 px-4 font-bold text-gray-600">Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map((donation) => (
                                <tr key={donation.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4 font-medium">{donation.full_name}</td>
                                    <td className="py-4 px-4 text-gray-500">{donation.email}</td>
                                    <td className="py-4 px-4 font-bold text-green-600">{donation.amount} €</td>
                                    <td className="py-4 px-4 text-gray-500">{new Date(donation.created_at).toLocaleDateString()}</td>
                                    <td className="py-4 px-4">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold uppercase">
                                            Complété
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {donations.length === 0 && !loading && (
                    <div className="text-center py-10 text-gray-500">
                        <p>Aucun don trouvé.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DonationsManagement
