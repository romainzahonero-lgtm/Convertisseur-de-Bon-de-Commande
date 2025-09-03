import { GoogleGenAI, Type } from "@google/genai";
import { type ExtractedData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("La variable d'environnement API_KEY n'est pas définie.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const extractPurchaseOrderData = async (file: File): Promise<ExtractedData> => {
  const imagePart = await fileToGenerativePart(file);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        parts: [
          imagePart,
          { text: "Extrais les informations principales et les articles de ce bon de commande/proforma. Pour les informations principales, fournis la date et le numéro du document. Pour chaque article, fournis le SKU, le code EAN13 si disponible, la désignation, la quantité, le prix d'achat unitaire et le prix total HT. Ignore les taxes, les frais de port et les totaux globaux." }
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
            header: {
                type: Type.OBJECT,
                properties: {
                    proformaDate: { type: Type.STRING, description: "Date de la proforma (au format MM/JJ/AAAA). Null si non trouvée." },
                    proformaNumber: { type: Type.STRING, description: "Numéro de la proforma. Null si non trouvé." }
                }
            },
            items: {
                type: Type.ARRAY,
                description: "Liste des articles du bon de commande.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        sku: { type: Type.STRING, description: "SKU (Stock Keeping Unit) de l'article. Null si non trouvé." },
                        ean13: { type: Type.STRING, description: "Code EAN13 de l'article. Null si non trouvé." },
                        designation: { type: Type.STRING, description: "Désignation ou description de l'article." },
                        quantity: { type: Type.NUMBER, description: "Quantité de l'article." },
                        purchasePrice: { type: Type.NUMBER, description: "Prix d'achat unitaire de l'article." },
                        lineTotalHT: { type: Type.NUMBER, description: "Prix total HT pour la ligne (quantité * prix d'achat)." }
                    },
                     required: ["designation", "quantity", "purchasePrice", "lineTotalHT"]
                }
            }
        },
        required: ["header", "items"]
      },
    },
  });
  
  const jsonText = response.text.trim();
  try {
    const parsedJson = JSON.parse(jsonText);
    return {
      header: parsedJson.header || { proformaDate: null, proformaNumber: null },
      items: parsedJson.items || []
    };
  } catch (e) {
    console.error("Échec de l'analyse de la réponse JSON :", jsonText);
    throw new Error("La réponse de l'API n'était pas un JSON valide.");
  }
};