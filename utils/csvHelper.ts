import { type OrderItem } from '../types';

// Déclare la variable globale XLSX fournie par le script CDN
declare var XLSX: any;

export const downloadXLSX = (data: OrderItem[], filename: string): void => {
  if (data.length === 0) {
    return;
  }

  // Mapper les données pour correspondre aux en-têtes et au formatage souhaités
  const formattedData = data.map(item => ({
    'Quantité': item.quantity,
    'SKU': item.sku || '',
    'EAN13': item.ean13 || '',
    'Désignation': item.designation,
    "Prix d'achat unitaire": item.purchasePrice,
    'Total HT': item.lineTotalHT,
  }));

  // Créer une feuille de calcul à partir des données formatées
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Améliorer la mise en forme de la feuille de calcul
  const priceFormat = '#,##0.00€';
  worksheet['!cols'] = [
      { wch: 10 }, // Quantité
      { wch: 15 }, // SKU
      { wch: 15 }, // EAN13
      { wch: 50 }, // Désignation
      { wch: 20 }, // Prix d'achat unitaire
      { wch: 20 }, // Total HT
  ];

  // Appliquer le format de devise aux colonnes de prix
  for (let i = 2; i <= formattedData.length + 1; i++) {
    const priceCellUnit = worksheet[`E${i}`];
    if(priceCellUnit) {
        priceCellUnit.t = 'n';
        priceCellUnit.z = priceFormat;
    }
    const priceCellTotal = worksheet[`F${i}`];
    if(priceCellTotal) {
        priceCellTotal.t = 'n';
        priceCellTotal.z = priceFormat;
    }
  }

  // Créer un nouveau classeur
  const workbook = XLSX.utils.book_new();
  
  // Ajouter la feuille de calcul au classeur
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bon de commande');

  // Générer le fichier XLSX et déclencher le téléchargement
  XLSX.writeFile(workbook, filename);
};