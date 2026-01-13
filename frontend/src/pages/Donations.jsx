import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    FaDonate,
    FaHandHoldingHeart,
    FaChurch,
    FaUsers,
    FaGlobe,
    FaShieldAlt,
    FaReceipt,
    FaCreditCard,
    FaPaypal,
    FaLock,
    FaCheckCircle,
    FaChartLine
} from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'

const Donations = () => {
    const { t } = useLanguage()
    const [selectedProject, setSelectedProject] = useState('general')
    const [donationAmount, setDonationAmount] = useState(50)
    const [isRecurring, setIsRecurring] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('card')

    const projects = [
        {
            id: 'general',
            title: t('home.donations.projects.general.title'),
            description: t('home.donations.projects.general.desc'),
            target: 50000,
            current: 0,
            icon: FaChurch,
            color: 'from-gold to-lightGold',
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
            features: t('home.donations.projects.youth.features', { returnObjects: true })
        }
    ]

    const donationOptions = [
        { amount: 20, label: t('home.donations.form.options.support') },
        { amount: 50, label: t('home.donations.form.options.regular'), popular: true },
        { amount: 100, label: t('home.donations.form.options.generous') },
        { amount: 250, label: t('home.donations.form.options.visionary') },
        { amount: 500, label: t('home.donations.form.options.transformer') }
    ]

    const selectedProjectData = projects.find(p => p.id === selectedProject) || projects[0]

    // Check for PayPal return parameters on mount
    React.useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const paymentId = queryParams.get('paymentId');
        const payerId = queryParams.get('PayerID');

        if (paymentId && payerId) {
            executeDonation(paymentId, payerId);
        }
    }, []);

    const executeDonation = async (paymentId, payerId) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/donations/execute/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ payment_id: paymentId, payer_id: payerId }),
            });

            if (response.ok) {
                alert(t('home.donations.form.success'));
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
            } else {
                alert(t('home.donations.form.error_validation'));
            }
        } catch (error) {
            console.error("Error executing donation:", error);
            alert(t('home.donations.form.error_finalization'));
        }
    }

    const handleDonate = async () => {
        if (!donationAmount) return

        try {
            const token = localStorage.getItem('access_token');
            const headers = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const returnUrl = `${window.location.origin}/donations`;
            const cancelUrl = `${window.location.origin}/donations?status=cancel`;

            const response = await fetch('http://127.0.0.1:8000/api/donations/create/', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    amount: donationAmount,
                    currency: 'EUR',
                    return_url: returnUrl,
                    cancel_url: cancelUrl,
                    is_anonymous: false // Could add checkbox for this
                }),
            });

            const data = await response.json();

            if (response.ok && data.approval_url) {
                window.location.href = data.approval_url;
            } else {
                alert(t('home.donations.form.error_init'));
            }
        } catch (error) {
            console.error("Error creating donation:", error);
            alert(t('home.donations.form.error_tech'));
        }
    }

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
                                <span className="text-2xl font-bold text-gold">
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
                                    <div className="text-2xl font-bold text-gold">{progressPercentage.toFixed(0)}%</div>
                                    <div className="text-sm text-gray-600">{t('home.donations.progress.budget')}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-gold">0</div>
                                    <div className="text-sm text-gray-600">{t('home.donations.progress.donors')}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-gold">--</div>
                                    <div className="text-sm text-gray-600">{t('home.donations.progress.days_left')}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center">
                                    <FaChartLine className="h-8 w-8 text-gold mb-2" />
                                    <div className="text-sm text-gray-600">{t('home.donations.progress.ongoing')}</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Donation Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        {/* Donation Form */}
                        <div className="bg-gradient-to-br from-bordeaux/10 to-gold/10 rounded-2xl p-6 shadow-xl border border-gold/20">
                            <h2 className="text-2xl font-bold text-bordeaux mb-6">{t('home.donations.form.title')}</h2>

                            {/* Amount Selection */}
                            <div className="mb-8">
                                <label className="block text-gray-700 mb-4 font-medium">{t('home.donations.form.amount_label')}</label>
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {donationOptions.map((option) => (
                                        <button
                                            key={option.amount}
                                            onClick={() => setDonationAmount(option.amount)}
                                            className={`p-4 rounded-xl border-2 transition-all duration-300 ${donationAmount === option.amount
                                                ? 'border-gold bg-gradient-to-r from-gold to-lightGold text-white transform scale-105'
                                                : 'border-gray-300 text-gray-700 hover:border-gold hover:bg-gold/10'
                                                } ${option.popular ? 'relative' : ''}`}
                                        >
                                            {option.popular && (
                                                <span className="absolute -top-2 -right-2 bg-gold text-white text-xs px-2 py-1 rounded-full">
                                                    {t('home.donations.form.options.popular')}
                                                </span>
                                            )}
                                            <div className="font-bold text-lg">${option.amount}</div>
                                            <div className="text-xs mt-1">{option.label}</div>
                                        </button>
                                    ))}
                                </div>

                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">$</span>
                                    <input
                                        type="number"
                                        value={donationAmount}
                                        onChange={(e) => setDonationAmount(e.target.value ? Number(e.target.value) : '')}
                                        placeholder={t('home.donations.form.custom_placeholder')}
                                        className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                                    />
                                </div>
                            </div>

                            {/* Recurring Donation */}
                            <div className="mb-8">
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={isRecurring}
                                            onChange={(e) => setIsRecurring(e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`block w-14 h-8 rounded-full transition-colors ${isRecurring ? 'bg-gold' : 'bg-gray-300'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isRecurring ? 'transform translate-x-6' : ''}`}></div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="font-medium text-gray-800">{t('home.donations.form.recurring')}</div>
                                        <p className="text-sm text-gray-600">{t('home.donations.form.recurring_desc')}</p>
                                    </div>
                                </label>
                            </div>

                            {/* Payment Method */}
                            <div className="mb-8">
                                <label className="block text-gray-700 mb-4 font-medium">{t('home.donations.form.payment_method')}</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setPaymentMethod('card')}
                                        className={`p-4 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${paymentMethod === 'card'
                                            ? 'border-gold bg-gold/10'
                                            : 'border-gray-300 hover:border-gold/50'
                                            }`}
                                    >
                                        <FaCreditCard className={`h-6 w-6 mr-2 ${paymentMethod === 'card' ? 'text-gold' : 'text-gray-500'}`} />
                                        <span className={`font-medium ${paymentMethod === 'card' ? 'text-gold' : 'text-gray-700'}`}>
                                            {t('home.donations.form.card')}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('paypal')}
                                        className={`p-4 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${paymentMethod === 'paypal'
                                            ? 'border-gold bg-gold/10'
                                            : 'border-gray-300 hover:border-gold/50'
                                            }`}
                                    >
                                        <FaPaypal className={`h-6 w-6 mr-2 ${paymentMethod === 'paypal' ? 'text-gold' : 'text-gray-500'}`} />
                                        <span className={`font-medium ${paymentMethod === 'paypal' ? 'text-gold' : 'text-gray-700'}`}>
                                            {t('home.donations.form.paypal')}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Security & Tax Info */}
                            <div className="mb-8 space-y-4">
                                {paymentMethod === 'card' && (
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start">
                                        <FaCreditCard className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                                        <p className="text-sm text-blue-800">
                                            {t('home.donations.form.card_note')}
                                        </p>
                                    </div>
                                )}
                                <div className="flex items-center text-gray-600">
                                    <FaLock className="h-5 w-5 text-gold mr-3" />
                                    <span className="text-sm">{t('home.donations.form.secure')}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FaReceipt className="h-5 w-5 text-gold mr-3" />
                                    <span className="text-sm">{t('home.donations.form.receipt_auto')}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FaShieldAlt className="h-5 w-5 text-gold mr-3" />
                                    <span className="text-sm">{t('home.donations.form.privacy')}</span>
                                </div>
                            </div>

                            {/* Donate Button */}
                            <button
                                onClick={handleDonate}
                                disabled={!donationAmount}
                                className="w-full bg-gradient-to-r from-gold to-lightGold text-white py-5 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center justify-center">
                                    <FaDonate className="mr-3 h-6 w-6" />
                                    {isRecurring ? t('home.donations.form.donate_monthly') : t('home.donations.form.donate_once')}
                                    {donationAmount && ` de $${donationAmount}`}
                                </div>
                            </button>
                        </div>

                        {/* Impact Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-r from-royalBlue to-blue-600 rounded-2xl p-6 text-white"
                        >
                            <h3 className="text-xl font-bold mb-4">{t('home.donations.impact.title')}</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                    <span>{t('home.donations.impact.bibles')}</span>
                                    <span className="font-bold">0</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                    <span>{t('home.donations.impact.families')}</span>
                                    <span className="font-bold">0</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                    <span>{t('home.donations.impact.missionaries')}</span>
                                    <span className="font-bold">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>{t('home.donations.impact.lives')}</span>
                                    <span className="font-bold">{t('home.donations.impact.many')}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Tax Receipt Info */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-bordeaux mb-3">{t('home.donations.tax.title')}</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                {t('home.donations.tax.desc')}
                            </p>
                            <button className="text-gold font-semibold hover:text-bordeaux transition-colors text-sm">
                                {t('home.donations.tax.more')} →
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Donations
