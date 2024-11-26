import PDFDocument from 'pdfkit';

interface InvoiceTemplate {
  // Company Information
  companyInfo: {
    name: string;
    logo: string;
    address: string;
    mc_number: string;
    dot_number: string;
    phone: string;
    email: string;
  };
  
  // Client Information
  clientInfo: {
    name: string;
    address: string;
    contact: string;
    phone: string;
    email: string;
  };
  
  // Load Details
  loadDetails: {
    loadId: string;
    origin: string;
    destination: string;
    pickupDate: Date;
    deliveryDate: Date;
    weight: number;
    distance: number;
  };
  
  // Payment Details
  paymentDetails: {
    lineHaul: number;
    fuelSurcharge?: number;
    detention?: number;
    otherCharges?: {
      description: string;
      amount: number;
    }[];
    paymentTerms: 'NET-30' | 'NET-60' | 'QUICK-PAY';
    quickPayDiscount?: number;
  };
}

const calculateDueDate = (issueDate: Date, terms: string): Date => {
  const date = new Date(issueDate);
  switch(terms) {
    case 'NET-30':
      date.setDate(date.getDate() + 30);
      break;
    case 'NET-60':
      date.setDate(date.getDate() + 60);
      break;
    case 'QUICK-PAY':
      date.setDate(date.getDate() + 3); // Typically 72 hours
      break;
  }
  return date;
};
