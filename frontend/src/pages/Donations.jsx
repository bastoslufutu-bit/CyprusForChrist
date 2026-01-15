import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    FaDonate,
    FaHandHoldingHeart,
    FaChurch,
    FaUsers,
    FaGlobe,
    FaShieldAlt,
    FaCheckCircle,
    FaChartLine,
    FaWhatsapp,
    FaEnvelope,
    FaArrowDown
} from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'

const Donations = () => {
    const { t } = useLanguage()
    const [selectedProject, setSelectedProject] = useState('general')

    const projects = [
        {
            id: 'general',
            title: t('home.donations.projects.general.title'),
            description: t('home.donations.projects.general.desc'),
            target: 50000,
            current: 0,
            icon: FaChurch,
            color: 'from-gold to-lightGold',
            activeColor: 'text-gold',
            message: "Chaque don est une semence d’amour, de foi et d’espérance. Votre générosité soutient l’œuvre de Dieu et bénit des vies.",
            features: t('home.donations.projects.general.features', { returnObjects: true })
        },
        {
            id: 'missions',
            title: t('home.donations.projects.missions.title'),
            description: t('home.donations.projects.missions.desc'),
            target: 75000,
            current: 0,
            icon: FaGlobe,
            color: 'from-royalBlue to-blue-400',
            activeColor: 'text-royalBlue',
            message: "Votre soutien permet d'envoyer des missionnaires, de planter des églises et de répandre l'Évangile jusqu'aux extrémités de la terre.",
            features: t('home.donations.projects.missions.features', { returnObjects: true })
        },
        {
            id: 'benevolence',
            title: t('home.donations.projects.benevolence.title'),
            description: t('home.donations.projects.benevolence.desc'),
            target: 30000,
            current: 0,
            icon: FaHandHoldingHeart,
            color: 'from-bordeaux to-pink-600',
            activeColor: 'text-bordeaux',
            message: "Aidez-nous à prendre soin des veuves, des orphelins et des démunis. Votre don apporte un réconfort concret et témoigne de l'amour du Christ.",
            features: t('home.donations.projects.benevolence.features', { returnObjects: true })
        },
        {
            id: 'youth',
            title: t('home.donations.projects.youth.title'),
            description: t('home.donations.projects.youth.desc'),
            target: 40000,
            current: 0,
            icon: FaUsers,
            color: 'from-green-500 to-emerald-400',
            activeColor: 'text-green-500',
            message: "Investissez dans la jeunesse pour former les leaders de demain. Votre don finance des camps, des formations et des programmes d'encadrement.",
            features: t('home.donations.projects.youth.features', { returnObjects: true })
        }
    ]

    const selectedProjectData = projects.find(p => p.id === selectedProject) || projects[0]
    const progressPercentage = (selectedProjectData.current / selectedProjectData.target) * 100

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gold to-lightGold rounded-full mb-4">
                        <FaDonate className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-playfair font-bold text-bordeaux mb-2">
                        {t('home.donations.title')}
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {t('home.donations.subtitle')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Project Selection */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Project Selection */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <h2 className="text-2xl font-bold text-bordeaux mb-6">{t('home.donations.projects.title')}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {projects.map((project) => {
                                    const Icon = project.icon
                                    return (
                                        <button
                                            key={project.id}
                                            onClick={() => setSelectedProject(project.id)}
                                            className={`p-6 rounded-xl border-2 text-left transition-all duration-300 ${selectedProject === project.id
                                                ? `border-gold bg-gradient-to-r ${project.color}/10 transform scale-[1.02]`
                                                : 'border-gray-200 hover:border-gold/50 hover:shadow-md'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-4 mb-4">
                                                <div className={`p-3 rounded-lg bg-gradient-to-r ${project.color}`}>
                                                    <Icon className="h-6 w-6 text-white" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-800">{project.title}</h3>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                                            <div className="space-y-2">
                                                {project.features && project.features.map((feature, index) => (
                                                    <div key={index} className="flex items-center text-sm text-gray-600">
                                                        <FaCheckCircle className="h-4 w-4 text-gold mr-2" />
                                                        <span>{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </motion.div>

                        {/* Project Progress */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-bordeaux">{t('home.donations.progress.title')}</h3>
                                <span className={`text-2xl font-bold ${selectedProjectData.activeColor || 'text-gold'}`}>
                                    ${selectedProjectData.current.toLocaleString()}
                                    <span className="text-gray-400 text-lg"> / ${selectedProjectData.target.toLocaleString()}</span>
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercentage}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`h-full bg-gradient-to-r ${selectedProjectData.color}`}
                                    />
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 mt-2">
                                    <span>{progressPercentage.toFixed(1)}% {t('home.donations.progress.reached')}</span>
                                    <span>{((selectedProjectData.target - selectedProjectData.current) / 1000).toFixed(0)}k {t('home.donations.progress.remaining')}</span>
                                </div>
                            </div>

                            {/* Project Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className={`text-2xl font-bold ${selectedProjectData.activeColor || 'text-gold'}`}>{progressPercentage.toFixed(0)}%</div>
                                    <div className="text-sm text-gray-600">{t('home.donations.progress.budget')}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className={`text-2xl font-bold ${selectedProjectData.activeColor || 'text-gold'}`}>0</div>
                                    <div className="text-sm text-gray-600">{t('home.donations.progress.donors')}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className={`text-2xl font-bold ${selectedProjectData.activeColor || 'text-gold'}`}>--</div>
                                    <div className="text-sm text-gray-600">{t('home.donations.progress.days_left')}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center">
                                    <FaChartLine className={`h-8 w-8 mb-2 ${selectedProjectData.activeColor || 'text-gold'}`} />
                                    <div className="text-sm text-gray-600">{t('home.donations.progress.ongoing')}</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Manual Donation Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8 h-full"
                    >
                        {/* Intro Card - Modern Glassmorphism Design */}
                        <div className="relative h-full overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 z-10 flex flex-col items-center text-center transition-all duration-500">

                            {/* Decorative Elements - Fixed Theme */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-bordeaux/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                            {/* Title & Description */}
                            <div className="mb-8 relative z-20">
                                <span className={`inline-block py-1 px-3 rounded-full bg-gold/10 text-gold text-xs font-bold tracking-wider mb-4 border border-gold/20 uppercase`}>
                                    Faire un don
                                </span>
                                <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-4">{selectedProjectData.title}</h2>
                                <div className="text-gray-600 italic text-lg leading-relaxed min-h-[60px]">
                                    "{selectedProjectData.message}" <br />
                                </div>
                                <p className="text-gray-400 text-sm mt-3">
                                    Pour le moment, nous privilégions une approche simple et humaine.
                                </p>
                            </div>

                            {/* Direct Contact Action */}
                            <div className="w-full bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/60 shadow-lg mb-8 transition-transform transform hover:-translate-y-1 duration-300 relative overflow-hidden group">
                                <div className="flex justify-center mb-4">
                                    <div className="p-4 bg-green-100/50 rounded-full shadow-lg shadow-green-100 animate-pulse">
                                        <FaWhatsapp className="h-8 w-8 text-[#25D366]" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Contactez-nous directement</h3>
                                <p className="text-gray-500 text-sm mb-6">
                                    Cliquez ci-dessous pour obtenir les instructions de don pour <span className="font-bold text-gray-800">{selectedProjectData.title}</span>.
                                </p>

                                {/* Visual Cue - Bouncing Arrow */}
                                <div className="flex justify-center mb-2 animate-bounce">
                                    <FaArrowDown className="h-4 w-4 text-green-500" />
                                </div>

                                <a
                                    href={`https://wa.me/?text=Bonjour,%20je%20souhaite%20faire%20un%20don%20pour%20le%20projet%20"${selectedProjectData.title}".%20Merci%20de%20me%20donner%20les%20instructions.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 group relative overflow-hidden"
                                >
                                    <span className="relative z-10">Nous écrire maintenant</span>
                                    <FaWhatsapp className="text-xl group-hover:rotate-12 transition-transform duration-300 relative z-10" />

                                    {/* Button Shine Effect */}
                                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:animate-shine" />
                                </a>
                                <div className="mt-4 text-center">
                                    <a
                                        href={`mailto:bastoslufutu@gmail.com?subject=Don%20pour%20le%20projet%20${encodeURIComponent(selectedProjectData.title)}&body=Bonjour%2C%0A%0AJe%20souhaite%20faire%20un%20don%20pour%20le%20projet%20"${encodeURIComponent(selectedProjectData.title)}".%20Pouvez-vous%20me%20transmettre%20les%20informations%20n%C3%A9cessaires%20(RIB%2FMobile%20Money)%20%3F%0A%0AMerci.`}
                                        className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaEnvelope /> ou par email
                                    </a>
                                </div>
                            </div>

                            {/* Transparency Section - Minimalist */}
                            <div className="border-t border-gray-100 pt-6 w-full text-left">
                                <div className="flex items-center space-x-2 mb-4">
                                    <FaShieldAlt className="text-gold" />
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Transparence</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 font-medium">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                                        <span>Dons volontaires</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                                        <span>Sans contrainte</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                                        <span>100% à l'œuvre</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Donations
