import React, { useState, useCallback } from 'react';
import { type ExtractedData } from './types';
import { AppState } from './types';
import { extractPurchaseOrderData } from './services/geminiService';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import Loader from './components/Loader';
import { downloadXLSX } from './utils/csvHelper';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INITIAL);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileConvert = useCallback(async (file: File) => {
    setAppState(AppState.PROCESSING);
    setError(null);
    setExtractedData(null);
    try {
      const data = await extractPurchaseOrderData(file);
      if (data.items.length === 0) {
          setError("Aucun article n'a pu être extrait du document. Veuillez essayer avec un autre fichier.");
          setAppState(AppState.ERROR);
      } else {
        setExtractedData(data);
        setAppState(AppState.RESULTS);
      }
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de la conversion. Veuillez vérifier la console pour plus de détails et réessayer.");
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleReset = useCallback(() => {
    setAppState(AppState.INITIAL);
    setExtractedData(null);
    setError(null);
  }, []);

  const handleDownload = useCallback(() => {
    if (extractedData && extractedData.items.length > 0) {
      downloadXLSX(extractedData.items, 'bon-de-commande.xlsx');
    }
  }, [extractedData]);

  const renderContent = () => {
    switch (appState) {
      case AppState.INITIAL:
        return <FileUpload onFileSelect={handleFileConvert} />;
      case AppState.PROCESSING:
        return <Loader message="Analyse du document et extraction des données..." />;
      case AppState.RESULTS:
        return (
          extractedData && (
            <DataTable 
              data={extractedData} 
              onDownload={handleDownload} 
              onReset={handleReset} 
            />
          )
        );
      case AppState.ERROR:
        return (
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Erreur !</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
            <button
              onClick={handleReset}
              className="mt-6 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Réessayer
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 font-sans">
        <Header />
        <main className="w-full max-w-4xl flex-grow flex items-center justify-center">
             <div className="w-full bg-white rounded-2xl shadow-2xl p-8 transition-all duration-500">
                {renderContent()}
            </div>
        </main>
        <Footer />
    </div>
  );
};

export default App;