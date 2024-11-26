interface InvoiceStatus {
  status: 'SENT' | 'VIEWED' | 'PAID' | 'OVERDUE';
  lastUpdated: Date;
  paymentReceived?: number;
  daysOverdue?: number;
}

const trackInvoiceStatus = async (invoiceId: string) => {
  // Track when invoice is viewed (through email link)
  // Track payment status
  // Calculate and notify if overdue
}; 