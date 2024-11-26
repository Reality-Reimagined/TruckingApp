import { supabase } from '../lib/supabase';

interface EmailData {
  to: string;
  invoiceNumber: string;
  amount: number;
  dueDate: Date;
  pdfBuffer: Buffer;
}

export const emailService = {
  async sendInvoice(data: EmailData) {
    try {
      // Upload PDF to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('invoices')
        .upload(
          `${data.invoiceNumber}.pdf`,
          data.pdfBuffer,
          { contentType: 'application/pdf' }
        );

      if (uploadError) throw uploadError;

      // Get public URL for the PDF
      const { data: urlData } = supabase
        .storage
        .from('invoices')
        .getPublicUrl(`${data.invoiceNumber}.pdf`);

      // Send email using your email service (e.g., SendGrid, AWS SES)
      const emailContent = {
        to: data.to,
        subject: `Invoice #${data.invoiceNumber}`,
        html: `
          <h2>Invoice #${data.invoiceNumber}</h2>
          <p>Amount Due: $${data.amount}</p>
          <p>Due Date: ${data.dueDate.toLocaleDateString()}</p>
          <p>Please find your invoice attached.</p>
          <a href="${urlData.publicUrl}">View Invoice</a>
        `,
        attachments: [{
          content: data.pdfBuffer.toString('base64'),
          filename: `Invoice-${data.invoiceNumber}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment'
        }]
      };

      // Implement your email sending logic here
      // await sendEmail(emailContent);

      return { success: true };
    } catch (error) {
      console.error('Error sending invoice email:', error);
      return { success: false, error };
    }
  }
}; 