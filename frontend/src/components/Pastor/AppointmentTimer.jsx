import React, { useState, useEffect } from 'react';
import { Clock, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AppointmentTimer = ({ appointments = [] }) => {
    const [nextAppt, setNextAppt] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        const findNextAppointment = () => {
            const now = new Date();
            const confirmedAppts = appointments
                .filter(appt => appt.status === 'CONFIRMED')
                .map(appt => ({
                    ...appt,
                    dateTime: new Date(`${appt.requested_date}T${appt.requested_time}`)
                }))
                .filter(appt => appt.dateTime > now)
                .sort((a, b) => a.dateTime - b.dateTime);

            if (confirmedAppts.length > 0) {
                setNextAppt(confirmedAppts[0]);
            } else {
                setNextAppt(null);
            }
        };

        findNextAppointment();
        const interval = setInterval(findNextAppointment, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [appointments]);

    useEffect(() => {
        if (!nextAppt) {
            setTimeLeft(null);
            return;
        }

        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = nextAppt.dateTime - now;

            if (difference <= 0) {
                setTimeLeft(null);
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);

            let timeString = "";
            if (days > 0) timeString += `${days}j `;
            if (hours > 0) timeString += `${hours}h `;
            timeString += `${minutes}m`;

            setTimeLeft(timeString);
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 60000);
        return () => clearInterval(interval);
    }, [nextAppt]);

    if (!nextAppt || !timeLeft) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8 p-6 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl shadow-xl shadow-indigo-200 dark:shadow-none text-white overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Clock size={120} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                            <Clock className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider mb-1">
                                Prochain Rendez-vous
                            </p>
                            <h3 className="text-2xl font-bold">
                                Le rendez-vous avec <span className="text-amber-300">{nextAppt.member_name}</span> est dans <span className="text-amber-300">{timeLeft}</span>
                            </h3>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm font-medium bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/20">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-indigo-200" />
                            <span>{nextAppt.requested_date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-indigo-200" />
                            <span>{nextAppt.requested_time}</span>
                        </div>
                        <div className="flex items-center gap-2 border-l border-white/20 pl-4">
                            <User size={16} className="text-indigo-200" />
                            <span className="italic">{nextAppt.subject}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AppointmentTimer;
