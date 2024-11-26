import React, { useState } from 'react';
import { Groq } from 'groq-sdk';
import { FileText, Truck, User, CheckCircle, AlertCircle } from 'lucide-react';
import DocumentUpload from './DocumentUpload';
import ProfileInfo from './ProfileInfo';
import BorderConnectDashboard from './BorderConnectDashboard';
import ResponseDisplay from './ResponseDisplay';

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
  const [apiResponse, setApiResponse] = useState<any>(null);

  const getPrompt = (text: string, mode: 'ACE' | 'ACI' = 'ACE') => `
    Analyze this shipping document and extract information in JSON format. Document type: ${mode}

    Required fields for ${mode}:
    ${mode === 'ACE' ? `
    - tripNumber (format: AAAA######A)
    - usPortOfArrival (4-digit code)
    - estimatedArrivalDateTime (format: YYYY-MM-DD HH:mm:ss)
    ` : `
    - carrierCode
    - subLocationCode
    - estimatedArrivalDateTime (format: YYYY-MM-DD HH:mm:ss)
    `}

    Common required fields:
    - shipment:
      * commodity: description of goods
      * quantity: number
      * quantityUnit: "BOX", "PALLET", or "CASE"
      * weight: number
      * weightUnit: "L" for pounds or "K" for kilograms
    - route:
      * portOfArrival: port code
      * estimatedArrival: datetime
      * provinceOfLoading: two-letter code
      * borderCrossing: location name
    - partners:
      * shipper:
        - name: company name
        - address: full address
      * consignee:
        - name: company name
        - address: full address
    - hazmat: boolean
    - customsValue: number in USD

    Return strictly in this JSON format:
    {
      "mode": "${mode}",
      ${mode === 'ACE' ? `
      "tripNumber": string,
      "usPortOfArrival": string,` : `
      "carrierCode": string,
      "subLocationCode": string,`}
      "shipment": {
        "commodity": string,
        "quantity": number,
        "quantityUnit": string,
        "weight": number,
        "weightUnit": string
      },
      "route": {
        "portOfArrival": string,
        "estimatedArrival": string,
        "provinceOfLoading": string,
        "borderCrossing": string
      },
      "partners": {
        "shipper": {
          "name": string,
          "address": string
        },
        "consignee": {
          "name": string,
          "address": string
        }
      },
      "hazmat": boolean,
      "customsValue": number
    }

    Document text:
    ${text}
  `;

  const analyzeDocument = async (text: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
      });

      const completion = await groq.chat.completions.create({
        messages: [{ 
          role: 'user', 
          content: getPrompt(text, 'ACE')  // or 'ACI' based on user selection
        }],
        model: 'mixtral-8x7b-32768',
        temperature: 0.1, // Lower temperature for more consistent JSON output
        response_format: { type: "json_object" }
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

  const handleSubmitToBorderConnect = async (data: any) => {
    try {
      // Your API call logic here
      const response = await sendToBorderConnect(data);
      setApiResponse(response);
    } catch (error) {
      console.error('Error submitting to BorderConnect:', error);
      // Handle error state
    }
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
            <BorderConnectDashboard
              parsedData={parsedData}
              profileData={profileData}
              onSubmit={handleSubmitToBorderConnect}
            />
          )}
          
          {apiResponse && <ResponseDisplay response={apiResponse} />}
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