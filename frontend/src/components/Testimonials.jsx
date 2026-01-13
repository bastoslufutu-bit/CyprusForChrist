import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaQuoteLeft, FaQuoteRight, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

// Données de témoignages
// Données de témoignages (Vide pour l'instant)
const testimonialsData = []

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    }

    const swipeConfidenceThreshold = 10000
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity
    }

    const paginate = (newDirection) => {
        setDirection(newDirection)
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex + newDirection
            if (nextIndex < 0) return testimonialsData.length - 1
            if (nextIndex >= testimonialsData.length) return 0
            return nextIndex
        })
    }

    const currentTestimonial = testimonialsData[currentIndex]

    if (testimonialsData.length === 0) return null

    return (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-bordeaux/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-playfair font-bold text-bordeaux mb-4">
                        Témoignages de <span className="text-gradient">Notre Communauté</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Découvrez comment Dieu agit dans la vie des membres de notre église
                    </p>
                </motion.div>

                {/* Main Testimonial Card */}
                <div className="max-w-4xl mx-auto relative">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = swipePower(offset.x, velocity.x)
                                if (swipe < -swipeConfidenceThreshold) {
                                    paginate(1)
                                } else if (swipe > swipeConfidenceThreshold) {
                                    paginate(-1)
                                }
                            }}
                            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative"
                        >
                            {/* Quote Marks */}
                            <FaQuoteLeft className="absolute top-6 left-6 text-gold/20 h-12 w-12" />
                            <FaQuoteRight className="absolute bottom-6 right-6 text-gold/20 h-12 w-12" />

                            {/* Content */}
                            <div className="text-center mb-8">
                                <div className="flex justify-center mb-6">
                                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                                        <FaStar key={i} className="h-6 w-6 text-gold mx-1" />
                                    ))}
                                </div>
                                <p className="text-2xl md:text-3xl text-gray-800 italic mb-8 leading-relaxed">
                                    "{currentTestimonial.content}"
                                </p>
                            </div>

                            {/* Author */}
                            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                                <div className="relative">
                                    <img
                                        src={currentTestimonial.avatar}
                                        alt={currentTestimonial.name}
                                        className="w-20 h-20 rounded-full object-cover border-4 border-gold/30"
                                    />
                                    <div className="absolute inset-0 rounded-full border-2 border-gold animate-ping opacity-50"></div>
                                </div>
                                <div className="text-center md:text-left">
                                    <h4 className="text-xl font-bold text-bordeaux">{currentTestimonial.name}</h4>
                                    <p className="text-gray-600">{currentTestimonial.role}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(currentTestimonial.date).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <button
                        onClick={() => paginate(-1)}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white/80 hover:bg-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-gold hover:text-bordeaux transition-all duration-300 group"
                    >
                        <FaChevronLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                        onClick={() => paginate(1)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white/80 hover:bg-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-gold hover:text-bordeaux transition-all duration-300 group"
                    >
                        <FaChevronRight className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                {/* Testimonial Dots */}
                <div className="flex justify-center mt-12 space-x-3">
                    {testimonialsData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1)
                                setCurrentIndex(index)
                            }}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'bg-gradient-to-r from-gold to-lightGold w-8'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>

                {/* Add Testimonial Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <button className="inline-flex items-center bg-gradient-to-r from-gold to-lightGold text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <FaQuoteLeft className="mr-3" />
                        Partager mon témoignage
                    </button>
                </motion.div>
            </div>
        </section>
    )
}

export default Testimonials
