import React, { useState, useEffect } from 'react';
import {
    FileText,
    Search,
    Plus,
    Edit,
    Trash2,
    Calendar,
    CheckCircle,
    Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RhemaFormModal = ({ rhema, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        title: rhema?.title || '',
        verse: rhema?.verse || '',
        content: rhema?.content || '',
        meditation: rhema?.meditation || '',
        published_at: rhema?.published_at || new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{rhema ? 'Modifier Rhema' : 'Nouveau Rhema'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Titre</label>
                        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 border-none dark:text-white" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Verset</label>
                        <input type="text" value={formData.verse} onChange={(e) => setFormData({ ...formData, verse: e.target.value })} className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 border-none dark:text-white" placeholder="ex: Jean 3:16" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Parole du Jour (Contenu)</label>
                        <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 border-none h-24 dark:text-white" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Méditation / Note du Pasteur (Optionnel)</label>
                        <textarea value={formData.meditation} onChange={(e) => setFormData({ ...formData, meditation: e.target.value })} className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 border-none h-24 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Date de publication</label>
                        <input type="date" value={formData.published_at} onChange={(e) => setFormData({ ...formData, published_at: e.target.value })} className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 border-none dark:text-white" required />
                    </div>
                    <div className="flex justify-end space-x-3 mt-8">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-xl font-bold">Annuler</button>
                        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20">Enregistrer</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const PastorRhema = () => {
    const [rhemas, setRhemas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingRhema, setEditingRhema] = useState(null);

    useEffect(() => {
        fetchRhemas();
    }, []);

    const fetchRhemas = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/rhema/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setRhemas(data.results || (Array.isArray(data) ? data : []));
        } catch (error) {
            console.error('Error fetching Rhema:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data) => {
        const token = localStorage.getItem('access_token');
        const url = editingRhema
            ? `http://127.0.0.1:8000/api/rhema/${editingRhema.id}/`
            : 'http://127.0.0.1:8000/api/rhema/';

        try {
            const response = await fetch(url, {
                method: editingRhema ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setShowModal(false);
                setEditingRhema(null);
                fetchRhemas();
            } else {
                const errorData = await response.json();
                alert(JSON.stringify(errorData));
            }
        } catch (error) {
            console.error('Error saving Rhema:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Voulez-vous vraiment supprimer ce Rhema ?')) return;
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://127.0.0.1:8000/api/rhema/${id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchRhemas();
            }
        } catch (error) {
            console.error('Error deleting Rhema:', error);
        }
    };

    const filteredRhemas = rhemas.filter(rhema =>
        (rhema.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (rhema.verse?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <AnimatePresence>
                {showModal && (
                    <RhemaFormModal
                        rhema={editingRhema}
                        onSave={handleSave}
                        onClose={() => { setShowModal(false); setEditingRhema(null); }}
                    />
                )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rhema du Jour</h1>
                    <p className="text-gray-500 dark:text-gray-400">Publiez des paroles inspirantes quotidiennes</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border-none rounded-xl text-sm w-full sm:w-64 focus:ring-2 focus:ring-indigo-500 shadow-sm dark:text-white"
                        />
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Nouveau Rhema</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRhemas.length > 0 ? (
                    filteredRhemas.map(rhema => (
                        <motion.div
                            key={rhema.id}
                            layout
                            className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => { setEditingRhema(rhema); setShowModal(true); }} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(rhema.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-1">{rhema.title}</h4>
                            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-4">{rhema.verse}</p>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 italic leading-relaxed">"{rhema.content}"</p>

                            {rhema.meditation && (
                                <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-2xl mb-6">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Note du Pasteur</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{rhema.meditation}</p>
                                </div>
                            )}

                            <div className="flex items-center text-xs text-gray-400 border-t border-gray-50 dark:border-slate-700 pt-4">
                                <Calendar className="w-3 h-3 mr-2" />
                                Publication prévue le: <span className="font-bold ml-1">{new Date(rhema.published_at).toLocaleDateString()}</span>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
                        <FileText className="w-16 h-16 text-gray-200 dark:text-slate-700 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Aucun Rhema trouvé.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PastorRhema;
