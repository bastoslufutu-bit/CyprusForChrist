import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRobot, FaUser, FaPaperPlane, FaBookOpen, FaSearch, FaChevronRight, FaChevronLeft } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'

const BibleAIAssistant = () => {
    const { language, t } = useLanguage()
    const [activeTab, setActiveTab] = useState('reading') // 'reading' or 'chat'

    // Bible Books Data with Translations
    const BOOKS_DATA = [
        { id: 1, fr: 'Genèse', en: 'Genesis' }, { id: 2, fr: 'Exode', en: 'Exodus' }, { id: 3, fr: 'Lévitique', en: 'Leviticus' },
        { id: 4, fr: 'Nombres', en: 'Numbers' }, { id: 5, fr: 'Deutéronome', en: 'Deuteronomy' }, { id: 6, fr: 'Josué', en: 'Joshua' },
        { id: 7, fr: 'Juges', en: 'Judges' }, { id: 8, fr: 'Ruth', en: 'Ruth' }, { id: 9, fr: '1 Samuel', en: '1 Samuel' },
        { id: 10, fr: '2 Samuel', en: '2 Samuel' }, { id: 11, fr: '1 Rois', en: '1 Kings' }, { id: 12, fr: '2 Rois', en: '2 Kings' },
        { id: 13, fr: '1 Chroniques', en: '1 Chronicles' }, { id: 14, fr: '2 Chroniques', en: '2 Chronicles' }, { id: 15, fr: 'Esdras', en: 'Ezra' },
        { id: 16, fr: 'Néhémie', en: 'Nehemiah' }, { id: 17, fr: 'Esther', en: 'Esther' }, { id: 18, fr: 'Job', en: 'Job' },
        { id: 19, fr: 'Psaumes', en: 'Psalms' }, { id: 20, fr: 'Proverbes', en: 'Proverbs' }, { id: 21, fr: 'Ecclésiaste', en: 'Ecclesiastes' },
        { id: 22, fr: 'Cantique des Cantiques', en: 'Song of Solomon' }, { id: 23, fr: 'Ésaïe', en: 'Isaiah' }, { id: 24, fr: 'Jérémie', en: 'Jeremiah' },
        { id: 25, fr: 'Lamentations', en: 'Lamentations' }, { id: 26, fr: 'Ézéchiel', en: 'Ezekiel' }, { id: 27, fr: 'Daniel', en: 'Daniel' },
        { id: 28, fr: 'Osée', en: 'Hosea' }, { id: 29, fr: 'Joël', en: 'Joel' }, { id: 30, fr: 'Amos', en: 'Amos' },
        { id: 31, fr: 'Abdias', en: 'Obadiah' }, { id: 32, fr: 'Jonas', en: 'Jonah' }, { id: 33, fr: 'Michée', en: 'Micah' },
        { id: 34, fr: 'Nahum', en: 'Nahum' }, { id: 35, fr: 'Habacuc', en: 'Habakkuk' }, { id: 36, fr: 'Sophonie', en: 'Zephaniah' },
        { id: 37, fr: 'Aggée', en: 'Haggai' }, { id: 38, fr: 'Zacharie', en: 'Zechariah' }, { id: 39, fr: 'Malachie', en: 'Malachi' },
        { id: 40, fr: 'Matthieu', en: 'Matthew' }, { id: 41, fr: 'Marc', en: 'Mark' }, { id: 42, fr: 'Luc', en: 'Luke' },
        { id: 43, fr: 'Jean', en: 'John' }, { id: 44, fr: 'Actes', en: 'Acts' }, { id: 45, fr: 'Romains', en: 'Romans' },
        { id: 46, fr: '1 Corinthiens', en: '1 Corinthians' }, { id: 47, fr: '2 Corinthiens', en: '2 Corinthians' }, { id: 48, fr: 'Galates', en: 'Galatians' },
        { id: 49, fr: 'Éphésiens', en: 'Ephesians' }, { id: 50, fr: 'Philippiens', en: 'Philippians' }, { id: 51, fr: 'Colossiens', en: 'Colossians' },
        { id: 52, fr: '1 Thessaloniciens', en: '1 Thessalonians' }, { id: 53, fr: '2 Thessaloniciens', en: '2 Thessalonians' }, { id: 54, fr: '1 Timothée', en: '1 Timothy' },
        { id: 55, fr: '2 Timothée', en: '2 Timothy' }, { id: 56, fr: 'Tite', en: 'Titus' }, { id: 57, fr: 'Philémon', en: 'Philemon' },
        { id: 58, fr: 'Hébreux', en: 'Hebrews' }, { id: 59, fr: 'Jacques', en: 'James' }, { id: 60, fr: '1 Pierre', en: '1 Peter' },
        { id: 61, fr: '2 Pierre', en: '2 Peter' }, { id: 62, fr: '1 Jean', en: '1 John' }, { id: 63, fr: '2 Jean', en: '2 John' },
        { id: 64, fr: '3 Jean', en: '3 John' }, { id: 65, fr: 'Jude', en: 'Jude' }, { id: 66, fr: 'Apocalypse', en: 'Revelation' }
    ]

    // Bible Reader State
    const [selectedBookId, setSelectedBookId] = useState(1)
    const [chapter, setChapter] = useState(1)
    const [bibleText, setBibleText] = useState('')
    const [loadingText, setLoadingText] = useState(false)

    // Chat State
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [isAiLoading, setIsAiLoading] = useState(false)

    // Initialize welcome message when language changes
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                id: 1,
                text: t('bible.ai_welcome') + " " + t('bible.ai_limit'),
                sender: 'ai',
                timestamp: new Date()
            }])
        }
    }, [language, t, messages.length])

    // Fetch Bible Text
    useEffect(() => {
        const fetchChapter = async () => {
            setLoadingText(true)
            try {
                // Determine version: ls1910 (French) or kjv (English)
                const version = language === 'fr' ? 'ls1910' : 'kjv'

                const response = await fetch(`https://api.getbible.net/v2/${version}/${selectedBookId}/${chapter}.json`)
                if (!response.ok) throw new Error('Failed to fetch')

                const data = await response.json()

                // Format the verses
                if (data.verses && Array.isArray(data.verses)) {
                    const fullText = data.verses.map(v =>
                        `<span class="font-bold text-sm text-bordeaux mr-1 select-none">[${v.verse}]</span>${v.text}`
                    ).join(' ')
                    setBibleText(fullText)
                } else {
                    setBibleText(t('bible.text_unavailable'))
                }
            } catch (error) {
                console.error("Error fetching bible text:", error)
                setBibleText(t('bible.error_fetch'))
            } finally {
                setLoadingText(false)
            }
        }
        if (activeTab === 'reading') {
            fetchChapter()
        }
    }, [selectedBookId, chapter, activeTab, language, t])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage = {
            id: messages.length + 1,
            text: input,
            sender: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        const currentInput = input
        setInput('')
        setIsAiLoading(true)

        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
            const response = await fetch(`${baseUrl}/ai/ask/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: currentInput,
                    language: language // Pass current language to backend
                }),
            })
            const data = await response.json()

            const aiMessage = {
                id: messages.length + 2,
                text: data.answer || data.response || t('bible.ai_technical_error'),
                sender: 'ai',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, aiMessage])
        } catch (error) {
            console.error('Error fetching AI response:', error)
            const aiMessage = {
                id: messages.length + 2,
                text: t('bible.ai_technical_error'),
                sender: 'ai',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, aiMessage])
        } finally {
            setIsAiLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4">

                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-playfair font-bold text-bordeaux mb-4">{t('bible.title')}</h1>
                    <p className="text-gray-600">{t('bible.subtitle')}</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-1 rounded-full shadow-md inline-flex">
                        <button
                            onClick={() => setActiveTab('reading')}
                            className={`px-8 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${activeTab === 'reading'
                                ? 'bg-gradient-to-r from-bordeaux to-purple-800 text-white shadow'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <FaBookOpen /> {t('bible.tab_reading')}
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`px-8 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${activeTab === 'chat'
                                ? 'bg-gradient-to-r from-gold to-yellow-600 text-white shadow'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <FaRobot /> {t('bible.tab_ai')}
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'reading' ? (
                            <motion.div
                                key="reading"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="p-6 md:p-10"
                            >
                                {/* Bible Controls */}
                                <div className="flex flex-wrap gap-4 items-center justify-between mb-8 bg-gray-50 p-4 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <select
                                            value={selectedBookId}
                                            onChange={(e) => {
                                                setSelectedBookId(parseInt(e.target.value))
                                                setChapter(1)
                                            }}
                                            className="p-3 border rounded-lg bg-white font-semibold text-gray-700 focus:ring-2 focus:ring-bordeaux focus:outline-none"
                                        >
                                            {BOOKS_DATA.map(book => (
                                                <option key={book.id} value={book.id}>
                                                    {language === 'fr' ? book.fr : book.en}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-500">{t('bible.chapter')}:</span>
                                            <input
                                                type="number"
                                                min="1"
                                                value={chapter}
                                                onChange={(e) => setChapter(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-20 p-3 border rounded-lg bg-white font-semibold focus:ring-2 focus:ring-bordeaux focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setChapter(Math.max(1, chapter - 1))}
                                            className="p-3 bg-white border rounded-full hover:bg-gray-100 text-gray-600"
                                            disabled={chapter <= 1}
                                        >
                                            <FaChevronLeft />
                                        </button>
                                        <button
                                            onClick={() => setChapter(chapter + 1)}
                                            className="p-3 bg-white border rounded-full hover:bg-gray-100 text-gray-600"
                                        >
                                            <FaChevronRight />
                                        </button>
                                    </div>
                                </div>

                                {/* Bible Text Display */}
                                {loadingText ? (
                                    <div className="flex justify-center py-20">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bordeaux"></div>
                                    </div>
                                ) : (
                                    <div className="prose max-w-none">
                                        <h2 className="text-3xl font-playfair font-bold text-center mb-8 text-gray-800">
                                            {language === 'fr'
                                                ? BOOKS_DATA.find(b => b.id === selectedBookId)?.fr
                                                : BOOKS_DATA.find(b => b.id === selectedBookId)?.en} {chapter}
                                        </h2>
                                        <div
                                            className="text-xl leading-relaxed text-gray-800 font-serif text-justify verse-content"
                                            dangerouslySetInnerHTML={{ __html: bibleText }}
                                        />
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="chat"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col h-[600px]"
                            >
                                <div className="bg-gradient-to-r from-gold/10 to-yellow-50 p-4 border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gold text-white p-2 rounded-full">
                                            <FaRobot />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{t('bible.ai_title')}</h3>
                                            <p className="text-xs text-gray-500">{t('bible.ai_subtitle')} {t('bible.ai_limit')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${message.sender === 'user'
                                                    ? 'bg-gradient-to-r from-bordeaux to-purple-900 text-white rounded-br-none'
                                                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                                    }`}
                                            >
                                                <p className="leading-relaxed">{message.text}</p>
                                                <span className={`text-[10px] block mt-2 opacity-70 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {isAiLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-white rounded-2xl p-4 rounded-bl-none shadow-sm flex gap-2 items-center">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 bg-white border-t">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder={t('bible.ai_placeholder')}
                                            className="flex-1 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold bg-gray-50"
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={isAiLoading || !input.trim()}
                                            className="bg-gold hover:bg-yellow-600 text-white p-4 rounded-xl transition-colors disabled:opacity-50"
                                        >
                                            <FaPaperPlane />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default BibleAIAssistant
