import React from 'react';
import { type ExtractedData } from '../types';
import Icon from './Icon';

interface DataTableProps {
  data: ExtractedData;
  onDownload: () => void;
  onReset: () => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, onDownload, onReset }) => {
  const { header, items } = data;

  const formatDate = (dateString: string | null): string | null => {
    if (!dateString) return null;
    
    // Si Gemini retourne déjà le bon format (ex: "12/25/2024"), on le garde.
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        return dateString;
    }

    // Essaye de parser d'autres formats comme YYYY-MM-DD
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont de 0 à 11
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    }
    
    // Si tout échoue, retourne la chaîne originale.
    return dateString;
  };

  const renderHeaderInfo = (label: string, value: string | null) => {
    if (!value) return null;
    const displayValue = label.toLowerCase().includes('date') ? formatDate(value) : value;
    return (
        <div className="flex items-center">
            <span className="font-semibold text-slate-600 mr-2">{label}:</span>
            <span className="text-slate-800">{displayValue}</span>
        </div>
    );
  };

  return (
    <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-4">Données Extraites</h2>

        <div className="bg-slate-50 rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:justify-around gap-4 border border-slate-200">
            {renderHeaderInfo("Date du document", header.proformaDate)}
            {renderHeaderInfo("Numéro du document", header.proformaNumber)}
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-100">
                <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Quantité</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">SKU</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">EAN13</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Désignation</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Prix d'achat unitaire</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Total HT</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                {items.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.sku || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.ean13 || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.designation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{item.purchasePrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{item.lineTotalHT.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
             <button
                onClick={onDownload}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
                <Icon name="download" className="w-5 h-5" />
                Télécharger en XLSX
            </button>
             <button
                onClick={onReset}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
                <Icon name="reset" className="w-5 h-5" />
                Convertir un autre fichier
            </button>
        </div>
    </div>
  );
};

export default DataTable;