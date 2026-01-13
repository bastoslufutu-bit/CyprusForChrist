import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
    FaBookOpen, FaRobot, FaMicrophone, FaPray,
    FaCalendarAlt, FaHandsHelping, FaSearch, FaChevronRight,
    FaPlay
} from 'react-icons/fa'

const modules = [
    {
        id: 'bible',
        title: 'Bible AI',
        icon: <FaRobot />,
        color: 'from-gold to-gold-light',
        options: [
            { name: 'Assistant Spirituel', path: '/bible-ai', icon: <FaRobot /> },
            { name: 'Lire la Bible', path: '/bible-ai', icon: <FaBookOpen /> },
            { name: 'Recherche Biblique', path: '/bible-ai', icon: <FaSearch /> },
        ]
    },
    {
        id: 'sermons',
        title: 'Sermons',
        icon: <FaMicrophone />,
        color: 'from-bordeaux to-bordeaux-dark',
        options: [
            { name: 'Dernières Prédications', path: '/sermons', icon: <FaPlay /> },
            { name: 'Notes de Messages', path: '/sermons', icon: <FaBookOpen /> },
            { name: 'Rechercher un Message', path: '/sermons', icon: <FaSearch /> },
        ]
    },
    {
        id: 'prière',
        title: 'Prière',
        icon: <FaPray />,
        color: 'from-gold to-gold-light',
        options: [
            { name: 'Demander une Prière', path: '/prayer-requests', icon: <FaPray /> },
            { name: 'Témoignages', path: '/prayer-requests', icon: <FaHandsHelping /> },
        ]
    },
    {
        id: 'activités',
        title: 'Activités',
        icon: <FaCalendarAlt />,
        color: 'from-bordeaux to-bordeaux-dark',
        options: [
            { name: 'Prochains Événements', path: '/', icon: <FaCalendarAlt /> },
            { name: 'S\'inscrire', path: '/contact', icon: <FaChevronRight /> },
        ]
    }
]

const ModuleGrid = () => {
    const [activeModule, setActiveModule] = useState(null)

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <span className="text-gold font-bold tracking-widest uppercase text-xs mb-4 block">Services & Vie de l'Église</span>
                    <h2 className="text-4xl md:text-5xl font-sans font-extrabold text-gray-900 mb-4">
                        Explorez nos <span className="text-gradient">Services</span>
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto font-medium">
                        Accédez rapidement à toutes les ressources et ministères de notre communauté.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {modules.map((module) => (
                        <div key={module.id} className="relative">
                            <motion.button
                                layout
                                onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-full h-48 rounded-3xl p-6 flex flex-col items-center justify-center space-y-4 shadow-xl transition-all duration-300 bg-gradient-to-br ${module.color} text-white`}
                            >
                                <div className="text-5xl">
                                    {module.icon}
                                </div>
                                <span className="text-2xl font-bold">{module.title}</span>
                            </motion.button>

                            <AnimatePresence>
                                {activeModule === module.id && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        className="absolute left-0 right-0 top-full mt-4 z-20 bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 space-y-2"
                                    >
                                        {module.options.map((option, idx) => (
                                            <Link
                                                key={idx}
                                                to={option.path}
                                                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-gold/10 group-hover:text-gold">
                                                    {option.icon}
                                                </div>
                                                <span className="text-gray-700 font-semibold text-sm group-hover:text-gold text-left">
                                                    {option.name}
                                                </span>
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ModuleGrid
