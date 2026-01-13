import React from 'react'
import { motion } from 'framer-motion'
import { FaArrowDown } from 'react-icons/fa'

// Using placeholders for photos - User will replace them in assets/images/
const images = [
    'https://images.unsplash.com/photo-1544427928-c49cdfebf194?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1510531704581-5b2870972060?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
]

const Hero = () => {
    return (
        <section className="relative min-h-screen bg-white flex flex-col items-center justify-center pt-20 overflow-hidden">
            {/* Background Texture/Accents */}
            <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gold/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-bordeaux/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-left z-10"
                    >
                        <div className="mb-8">
                            <img
                                src="/src/assets/logo/logo.png"
                                alt="Logo"
                                className="h-16 w-auto mb-6"
                                onError={(e) => {
                                    e.target.style.display = 'none'; // Hide if not yet uploaded
                                }}
                            />
                            <h2 className="text-gold font-bold tracking-widest uppercase text-sm mb-4">
                                Bienvenue à Cyprus For Christ
                            </h2>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-sans font-extrabold text-gray-900 mb-6 leading-tight">
                            Une Église <br />
                            <span className="text-gradient">Sans Frontières</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 max-w-lg font-medium leading-relaxed">
                            Bâtir une génération de disciples passionnés pour Christ, impactant Chypre et le reste du monde.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5">
                            <button className="bg-bordeaux text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-bordeaux-dark transition-all transform hover:scale-105">
                                Découvrir nos activités
                            </button>
                            <button className="border-2 border-gold text-gold px-10 py-4 rounded-full font-bold hover:bg-gold/5 transition-all">
                                Nous rejoindre
                            </button>
                        </div>
                    </motion.div>

                    {/* Photo Grid (Masonry-like) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="grid grid-cols-2 gap-4 h-[600px] relative"
                    >
                        <div className="space-y-4 pt-12">
                            <div className="h-64 rounded-3xl overflow-hidden shadow-2xl">
                                <img src={images[0]} alt="Activity 1" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="h-80 rounded-3xl overflow-hidden shadow-2xl">
                                <img src={images[1]} alt="Activity 2" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-80 rounded-3xl overflow-hidden shadow-2xl">
                                <img src={images[2]} alt="Activity 3" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="h-64 rounded-3xl overflow-hidden shadow-2xl">
                                <img src={images[3]} alt="Activity 4" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                            </div>
                        </div>

                        {/* Decorative floating icon */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gold/10 rounded-full animate-bounce blur-sm z-0"></div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gold opacity-50"
            >
                <FaArrowDown className="h-6 w-6" />
            </motion.div>
        </section>
    )
}

export default Hero
