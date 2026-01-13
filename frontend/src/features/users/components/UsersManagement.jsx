import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaUserEdit, FaKey, FaTrash, FaPlus, FaFilter, FaToggleOn, FaToggleOff, FaUserPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { userService } from '../api'

const UsersManagement = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)
    const [showRoleModal, setShowRoleModal] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)

    const roles = [
        { value: '', label: 'Tous les rôles' },
        { value: 'ADMIN', label: 'Administrateur' },
        { value: 'PASTOR', label: 'Pasteur' },
        { value: 'MODERATOR', label: 'Modérateur' },
        { value: 'MEMBER', label: 'Membre' }
    ]

    const loadUsers = async () => {
        setLoading(true)
        try {
            const params = {}
            if (searchTerm) params.search = searchTerm
            if (roleFilter) params.role = roleFilter

            const data = await userService.getUsers(params)
            setUsers(data)
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUsers()
    }, [searchTerm, roleFilter])

    const handleRoleChange = async (userId, newRole) => {
        try {
            await userService.changeRole(userId, newRole)
            loadUsers()
            setShowRoleModal(false)
            alert('Rôle modifié avec succès !')
        } catch (error) {
            console.error('Error changing role:', error)
            alert('Erreur lors du changement de rôle')
        }
    }

    const handlePasswordReset = async (userId) => {
        const newPassword = prompt('Entrez le nouveau mot de passe (laissez vide pour générer automatiquement):')
        if (newPassword === null) return

        try {
            const data = await userService.resetPassword(userId, newPassword || undefined)
            alert(`Mot de passe réinitialisé: ${data.temporary_password}`)
        } catch (error) {
            console.error('Error resetting password:', error)
            alert('Erreur lors de la réinitialisation')
        }
    }

    const handleToggleActive = async (userId) => {
        try {
            await userService.toggleActive(userId)
            loadUsers()
        } catch (error) {
            console.error('Error toggling active status:', error)
            alert('Erreur lors du changement de statut')
        }
    }

    const handleDelete = async (userId) => {
        if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.')) return

        try {
            await userService.deleteUser(userId)
            loadUsers()
            alert('Utilisateur supprimé !')
        } catch (error) {
            console.error('Error deleting user:', error)
            alert('Erreur lors de la suppression')
        }
    }

    if (loading && users.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bordeaux"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email ou username..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-bordeaux/20 focus:border-bordeaux transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-bordeaux/20 appearance-none bg-white cursor-pointer min-w-[180px]"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            {roles.map(role => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                            ))}
                        </select>
                    </div>
                    <Link
                        to="/admin/create-pastor"
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-lightGold text-white rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                        <FaUserPlus /> Nouveau Pasteur
                    </Link>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 font-bold text-gray-600">Utilisateur</th>
                                <th className="px-6 py-4 font-bold text-gray-600">Email</th>
                                <th className="px-6 py-4 font-bold text-gray-600">Rôle</th>
                                <th className="px-6 py-4 font-bold text-gray-600">Statut</th>
                                <th className="px-6 py-4 font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{user.username}</div>
                                                <div className="text-sm text-gray-500">{user.first_name} {user.last_name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                                            user.role === 'PASTOR' ? 'bg-gold/10 text-gold' :
                                                user.role === 'MODERATOR' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-green-100 text-green-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <button
                                            onClick={() => handleToggleActive(user.id)}
                                            className={`flex items-center gap-2 p-1 rounded-full transition-colors ${user.is_active ? 'text-green-500' : 'text-gray-300'
                                                }`}
                                            title={user.is_active ? 'Désactiver' : 'Activer'}
                                        >
                                            {user.is_active ? <FaToggleOn size={28} /> : <FaToggleOff size={28} />}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user)
                                                    setShowRoleModal(true)
                                                }}
                                                className="p-3 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-all border border-orange-200 shadow-sm"
                                                title="Modifier le rôle"
                                            >
                                                <FaUserEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handlePasswordReset(user.id)}
                                                className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all border border-blue-200 shadow-sm"
                                                title="Réinitialiser le mot de passe"
                                            >
                                                <FaKey size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-200 shadow-sm"
                                                title="Supprimer l'utilisateur"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Role Modal */}
            {showRoleModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                    >
                        <h2 className="text-xl font-bold mb-4">Changer le rôle de {selectedUser.username}</h2>
                        <div className="space-y-3">
                            {roles.filter(r => r.value).map(role => (
                                <button
                                    key={role.value}
                                    onClick={() => handleRoleChange(selectedUser.id, role.value)}
                                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${selectedUser.role === role.value
                                        ? 'bg-bordeaux text-white border-bordeaux font-bold'
                                        : 'hover:bg-gray-50 border-gray-200'
                                        }`}
                                >
                                    {role.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowRoleModal(false)}
                            className="w-full mt-6 py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
                        >
                            Annuler
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default UsersManagement
