import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Download, RefreshCw } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ResponseDisplayProps {
  response: {
    data: string;
    dateTime?: string;
    cbpDateTime?: string;
    cbsaDateTime?: string;
    type?: string;
    sendRequest?: {
      type: string;
      tripNumber: string;
    };
    processingResponse?: {
      shipmentsAccepted: number;
      shipmentsRejected: number;
    };
  };
  onRetry?: () => void;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response, onRetry }) => {
  const isACE = response.data === 'ACE_RESPONSE';
  const isSuccess = 
    (isACE && response.processingResponse?.shipmentsRejected === 0) || 
    (!isACE && response.type === 'ACCEPT');

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(16);
    doc.text(isACE ? 'ACE Response Report' : 'ACI Response Report', 20, 20);
    
    // Add response details
    doc.setFontSize(12);
    doc.text(`Trip Number: ${response.sendRequest?.tripNumber}`, 20, 40);
    doc.text(`Status: ${isSuccess ? 'Accepted' : 'Rejected'}`, 20, 50);
    doc.text(`Submission Time: ${response.dateTime}`, 20, 60);
    doc.text(`Processing Time: ${isACE ? response.cbpDateTime : response.cbsaDateTime}`, 20, 70);

    if (isACE && response.processingResponse) {
      doc.text('Processing Results:', 20, 90);
      doc.text(`Shipments Accepted: ${response.processingResponse.shipmentsAccepted}`, 30, 100);
      doc.text(`Shipments Rejected: ${response.processingResponse.shipmentsRejected}`, 30, 110);
    }

    // Save the PDF
    doc.save(`border-connect-response-${response.sendRequest?.tripNumber}.pdf`);
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(response, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `border-connect-response-${response.sendRequest?.tripNumber}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="flex items-center justify-between mb-4"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            {isACE ? 'ACE Response' : 'ACI Response'}
          </h2>
          <motion.div
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            className={`flex items-center gap-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}
          >
            {isSuccess ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{isSuccess ? 'Accepted' : 'Rejected'}</span>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Timing Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timing Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Submission Time</p>
                <p className="text-sm font-medium">{response.dateTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {isACE ? 'CBP Processing Time' : 'CBSA Processing Time'}
                </p>
                <p className="text-sm font-medium">
                  {isACE ? response.cbpDateTime : response.cbsaDateTime}
                </p>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Trip Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Trip Number</span>
                <span className="text-sm font-medium">{response.sendRequest?.tripNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Request Type</span>
                <span className="text-sm font-medium">{response.sendRequest?.type}</span>
              </div>
            </div>
          </div>

          {/* Processing Results (ACE specific) */}
          {isACE && response.processingResponse && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Processing Results</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">
                    {response.processingResponse.shipmentsAccepted} Accepted
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-600">
                    {response.processingResponse.shipmentsRejected} Rejected
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Download Options */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3 mt-6"
          >
            <div className="relative group">
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block">
                <div className="bg-gray-800 text-white text-xs rounded py-1 px-2">
                  Download as PDF
                </div>
              </div>
            </div>

            <div className="relative group">
              <button 
                onClick={handleDownloadJSON}
                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                JSON
              </button>
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block">
                <div className="bg-gray-800 text-white text-xs rounded py-1 px-2">
                  Download raw JSON
                </div>
              </div>
            </div>

            {!isSuccess && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRetry}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Submission
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResponseDisplay; 