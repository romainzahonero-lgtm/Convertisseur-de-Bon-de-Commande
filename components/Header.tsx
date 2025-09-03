
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center mb-8 w-full max-w-4xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">
                Convertisseur de Bon de Commande
            </h1>
            <p className="mt-4 text-lg text-slate-600">
                Extrayez facilement les données de vos bons de commande PDF et exportez-les vers un fichier CSV compatible Excel.
            </p>
        </header>
    );
};

export default Header;
