import React, { useState } from 'react';
import { Groq } from 'groq-sdk';
import { FileText, Truck, User, CheckCircle, AlertCircle } from 'lucide-react';
import DocumentUpload from './DocumentUpload';
import ProfileInfo from './ProfileInfo';

interface ParsedData {
  commodityType?: string;
  weight?: string;
  shipper?: string;
  consignee?: string;
  [key: string]: any;
}

const CrossBorderDocs = () => {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeDocument = async (text: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
      });

      const prompt = `
        Analyze this shipping document and extract the following information in JSON format:
        - commodityType: The type of goods being shipped
        - weight: The weight of the shipment
        - shipper: The shipping company or sender
        - consignee: The receiving company
        - hazmat: Whether it contains hazardous materials (true/false)
        - customsValue: The declared value for customs
        
        Document text:
        ${text}
      `;

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'mixtral-8x7b-32768',
      });

      const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
      setParsedData(result);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze document. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitToBorderConnect = () => {
    // TODO: Implement BorderConnect API integration
    console.log('Submitting to BorderConnect:', {
      ...parsedData,
      // Combine with profile data
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cross-Border Documentation</h1>
          <p className="text-gray-600 mt-1">Upload and process your border crossing documents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Document Upload
            </h2>
            <DocumentUpload onDocumentProcessed={analyzeDocument} />
          </div>

          {parsedData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Extracted Information</h2>
              <div className="space-y-4">
                {Object.entries(parsedData).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2">
                    <div className="w-1/3 text-sm font-medium text-gray-500">
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </div>
                    <div className="w-2/3 text-sm text-gray-900">{value?.toString()}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSubmitToBorderConnect}
                className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit to BorderConnect
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <ProfileInfo />
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Submission Checklist
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Driver Information Complete
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Vehicle Details Updated
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                Insurance Documentation
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                Customs Documentation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossBorderDocs;