import React from 'react';

const Loader = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-bordeaux to-royalBlue">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gold"></div>
                <p className="mt-4 text-white text-xl font-playfair">Chargement...</p>
            </div>
        </div>
    );
};

export default Loader;
