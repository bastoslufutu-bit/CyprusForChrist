import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaDonate, FaHandHoldingHeart, FaChurch, FaUsers, FaCheckCircle, FaLock, FaQuoteLeft } from 'react-icons/fa'

const DonationSection = () => {
    const [selectedAmount, setSelectedAmount] = useState(50)
    const [selectedProject, setSelectedProject] = useState('general')

    const donationAmounts = [20, 50, 100, 250, 500]
    const projects = [
        {
            id: 'general',
            title: 'Fonds Général',
            description: 'Soutenir les besoins quotidiens de l\'église (loyer, équipements, événements)',
            icon: FaChurch,
            color: 'from-gold to-lightGold'
        },
        {
            id: 'missions',
            title: 'Missions',
            description: 'Soutenez la mission à l\'étranger',
            icon: FaUsers,
            color: 'from-royalBlue to-blue-400'
        },
        {
            id: 'benevolence',
            title: 'Fonds de Bienveillance',
            description: 'Aidez les membres dans le besoin',
            icon: FaHandHoldingHeart,
            color: 'from-bordeaux to-pink-600'
        }
    ]

    const features = [
        {
            icon: FaLock,
            title: 'Sécurisé',
            description: 'Paiements cryptés et sécurisés'
        },
        {
            icon: FaCheckCircle,
            title: 'Reçu Fiscal',
            description: 'Reçu fiscal délivré immédiatement'
        },
        {
            icon: FaDonate,
            title: 'Récurrent',
            description: 'Option de don mensuel disponible'
        },
        {
            icon: FaHandHoldingHeart,
            title: 'Transparent',
            description: 'Rapports financiers réguliers'
        }
    ]

    const handleDonate = () => {
        // Logique de don (PayPal, Stripe integration later)
        console.log('Don de', selectedAmount, 'pour le projet', selectedProject)
        alert(`Merci pour votre intention de don de $${selectedAmount} pour le projet ${selectedProject}. Redirection vers le module de paiement en cours...`)
    }

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-playfair font-bold text-bordeaux mb-4">
                        Soutenez <span className="text-gradient">Notre Mission</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Votre don contribue à répandre l'Évangile et à soutenir notre communauté à Chypre "Cyprus For Christ"
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - Projects */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-2xl font-bold text-bordeaux mb-6">Choisissez un projet</h3>
                        <div className="space-y-4 mb-8">
                            {projects.map((project) => {
                                const Icon = project.icon
                                return (
                                    <button
                                        key={project.id}
                                        onClick={() => setSelectedProject(project.id)}
                                        className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-300 ${selectedProject === project.id
                                            ? `border-gold bg-gradient-to-r ${project.color}/10 shadow-lg`
                                            : 'border-gray-200 hover:border-gold/50 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-3 rounded-lg bg-gradient-to-r ${project.color}`}>
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-800">{project.title}</h4>
                                                <p className="text-gray-600 text-sm">{project.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                                >
                                    <feature.icon className="h-8 w-8 text-gold mb-2" />
                                    <h4 className="font-semibold text-gray-800">{feature.title}</h4>
                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column - Donation Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-bordeaux/10 to-gold/10 rounded-2xl p-8 shadow-xl"
                    >
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-bordeaux mb-2">Montant du don</h3>
                            <p className="text-gray-600 mb-6">Choisissez un montant ou entrez un montant personnalisé</p>

                            {/* Amount Selection */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                                {donationAmounts.map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setSelectedAmount(amount)}
                                        className={`p-4 rounded-xl border-2 text-lg font-bold transition-all duration-300 ${selectedAmount === amount
                                            ? 'border-gold bg-gradient-to-r from-gold to-lightGold text-white transform scale-105'
                                            : 'border-gray-300 text-gray-700 hover:border-gold hover:bg-gold/10'
                                            }`}
                                    >
                                        ${amount}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Amount */}
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Montant personnalisé</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        placeholder="Autre montant"
                                        className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                                        onChange={(e) => setSelectedAmount(parseFloat(e.target.value) || null)}
                                    />
                                </div>
                            </div>

                            {/* Recurring Donation */}
                            <div className="mb-8">
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only" />
                                        <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                                        <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                                    </div>
                                    <span className="ml-3 font-medium text-gray-700">
                                        Faire un don mensuel récurrent
                                    </span>
                                </label>
                            </div>

                            {/* Donate Button */}
                            <button
                                onClick={handleDonate}
                                disabled={!selectedAmount}
                                className="w-full bg-gradient-to-r from-gold to-lightGold text-white py-5 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center justify-center">
                                    <FaDonate className="mr-3 h-6 w-6" />
                                    Faire un don de ${selectedAmount || '--'}
                                </div>
                            </button>

                            {/* Secure Payment Info */}
                            <div className="mt-6 text-center">
                                <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
                                    <FaLock className="h-4 w-4" />
                                    <span className="text-sm">Paiement 100% sécurisé</span>
                                </div>
                                <div className="flex justify-center space-x-4 opacity-60">
                                    {/* Payment Icons */}
                                    <div className="h-8 w-12 bg-gray-200 rounded"></div>
                                    <div className="h-8 w-12 bg-gray-200 rounded"></div>
                                    <div className="h-8 w-12 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>


                    </motion.div>
                </div>

                {/* Annual Report Link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12 pt-8 border-t border-gray-200"
                >
                    <p className="text-gray-600 mb-2">
                        Nous croyons en la transparence financière
                    </p>
                    <button className="text-gold font-semibold hover:text-bordeaux transition-colors underline">
                        Voir notre rapport financier annuel →
                    </button>
                </motion.div>
            </div>
        </section>
    )
}

export default DonationSection
