import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { downloadInvoice } from './PDFGenerator';

export const InvoiceCreator: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const [paymentTerms, setPaymentTerms] = useState<'NET-30' | 'NET-60' | 'QUICK-PAY'>('NET-30');

  const onSubmit = (data: any) => {
    const invoiceData = {
      invoiceNumber: generateInvoiceNumber(), // Implement this helper
      issueDate: new Date(),
      companyInfo: {
        // Pull from user profile/company info
      },
      clientInfo: {
        name: data.clientName,
        address: data.clientAddress,
        contact: data.clientContact,
        phone: data.clientPhone,
        email: data.clientEmail,
      },
      loadDetails: {
        // Pull from selected load
      },
      paymentDetails: {
        lineHaul: parseFloat(data.lineHaul),
        fuelSurcharge: parseFloat(data.fuelSurcharge),
        detention: parseFloat(data.detention),
        paymentTerms,
        quickPayDiscount: paymentTerms === 'QUICK-PAY' ? 5 : undefined, // Configurable
      },
    };

    downloadInvoice(invoiceData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Form fields here */}
      <div>
        <label>Payment Terms</label>
        <select 
          value={paymentTerms}
          onChange={(e) => setPaymentTerms(e.target.value as any)}
          className="form-select"
        >
          <option value="NET-30">Net 30</option>
          <option value="NET-60">Net 60</option>
          <option value="QUICK-PAY">Quick Pay (5% discount)</option>
        </select>
      </div>
      
      <button 
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate Invoice
      </button>
    </form>
  );
}; 