import PDFDocument from 'pdfkit';
import { format } from 'date-fns';
import fs from 'fs';

interface PDFGeneratorProps extends InvoiceTemplate {
  invoiceNumber: string;
  issueDate: Date;
}

const generatePDF = (props: PDFGeneratorProps) => {
  const doc = new PDFDocument({ margin: 50, size: 'LETTER' });
  const blue = '#0047AB';  // Professional blue color

  // Helper functions
  const drawHorizontalLine = (y: number) => {
    doc.strokeColor(blue).moveTo(50, y).lineTo(550, y).stroke();
  };

  const drawTableHeader = (items: string[], y: number) => {
    doc.font('Helvetica-Bold');
    items.forEach((item, i) => {
      doc.text(item, 50 + (i * 125), y);
    });
    doc.font('Helvetica');
  };

  // Header Section
  if (props.companyInfo.logo) {
    doc.image(props.companyInfo.logo, 50, 45, { width: 100 });
  }

  doc.fontSize(20)
     .fillColor(blue)
     .text(props.companyInfo.name, 170, 45)
     .fontSize(10)
     .fillColor('black')
     .text(props.companyInfo.address, 170, 70)
     .text(`Phone: ${props.companyInfo.phone}`, 170, 85)
     .text(`MC#: ${props.companyInfo.mc_number}`, 170, 100)
     .text(`DOT#: ${props.companyInfo.dot_number}`, 170, 115);

  // Invoice Details (right-aligned)
  doc.fontSize(16)
     .fillColor(blue)
     .text('INVOICE', 400, 45, { align: 'right' })
     .fontSize(10)
     .fillColor('black')
     .text(`Invoice #: ${props.invoiceNumber}`, 400, 70, { align: 'right' })
     .text(`Issue Date: ${format(props.issueDate, 'MM/dd/yyyy')}`, 400, 85, { align: 'right' })
     .text(`Due Date: ${format(calculateDueDate(props.issueDate, props.paymentDetails.paymentTerms), 'MM/dd/yyyy')}`, 400, 100, { align: 'right' });

  drawHorizontalLine(140);

  // Bill To Section
  doc.fontSize(12)
     .fillColor(blue)
     .text('BILL TO:', 50, 160)
     .fontSize(10)
     .fillColor('black')
     .text(props.clientInfo.name, 50, 180)
     .text(props.clientInfo.address, 50, 195)
     .text(`Contact: ${props.clientInfo.contact}`, 50, 210)
     .text(`Phone: ${props.clientInfo.phone}`, 50, 225);

  // Load Details
  doc.fontSize(12)
     .fillColor(blue)
     .text('LOAD DETAILS:', 300, 160)
     .fontSize(10)
     .fillColor('black')
     .text(`Load ID: ${props.loadDetails.loadId}`, 300, 180)
     .text(`From: ${props.loadDetails.origin}`, 300, 195)
     .text(`To: ${props.loadDetails.destination}`, 300, 210)
     .text(`Distance: ${props.loadDetails.distance} miles`, 300, 225);

  drawHorizontalLine(250);

  // Charges Table
  doc.fontSize(12)
     .fillColor(blue)
     .text('CHARGES:', 50, 270);

  drawTableHeader(['Description', 'Rate', 'Amount'], 290);

  let yPosition = 310;

  // Line Haul
  doc.text('Line Haul', 50, yPosition)
     .text(`$${props.paymentDetails.lineHaul.toFixed(2)}`, 425, yPosition, { align: 'right' });
  yPosition += 20;

  // Fuel Surcharge
  if (props.paymentDetails.fuelSurcharge) {
    doc.text('Fuel Surcharge', 50, yPosition)
       .text(`$${props.paymentDetails.fuelSurcharge.toFixed(2)}`, 425, yPosition, { align: 'right' });
    yPosition += 20;
  }

  // Detention
  if (props.paymentDetails.detention) {
    doc.text('Detention', 50, yPosition)
       .text(`$${props.paymentDetails.detention.toFixed(2)}`, 425, yPosition, { align: 'right' });
    yPosition += 20;
  }

  // Other Charges
  props.paymentDetails.otherCharges?.forEach(charge => {
    doc.text(charge.description, 50, yPosition)
       .text(`$${charge.amount.toFixed(2)}`, 425, yPosition, { align: 'right' });
    yPosition += 20;
  });

  // Calculate total
  const total = [
    props.paymentDetails.lineHaul,
    props.paymentDetails.fuelSurcharge || 0,
    props.paymentDetails.detention || 0,
    ...(props.paymentDetails.otherCharges?.map(c => c.amount) || [])
  ].reduce((sum, curr) => sum + curr, 0);

  // Apply quick pay discount if applicable
  let finalTotal = total;
  if (props.paymentDetails.paymentTerms === 'QUICK-PAY' && props.paymentDetails.quickPayDiscount) {
    const discount = total * (props.paymentDetails.quickPayDiscount / 100);
    finalTotal = total - discount;
    
    doc.text('Quick Pay Discount', 50, yPosition)
       .text(`-$${discount.toFixed(2)}`, 425, yPosition, { align: 'right' });
    yPosition += 20;
  }

  drawHorizontalLine(yPosition + 10);

  // Total
  doc.fontSize(12)
     .fillColor(blue)
     .text('TOTAL:', 300, yPosition + 30)
     .text(`$${finalTotal.toFixed(2)}`, 425, yPosition + 30, { align: 'right' });

  // Payment Terms
  doc.fontSize(10)
     .fillColor('black')
     .text(`Payment Terms: ${props.paymentDetails.paymentTerms}`, 50, yPosition + 60)
     .text('Please include invoice number on all payments', 50, yPosition + 75)
     .text('Thank you for your business!', 50, yPosition + 90);

  return doc;
};

export const downloadInvoice = (props: PDFGeneratorProps) => {
  const doc = generatePDF(props);
  const fileName = `Invoice-${props.invoiceNumber}-${format(props.issueDate, 'yyyy-MM-dd')}.pdf`;
  
  // For browser download
  doc.pipe(fs.createWriteStream(fileName));
  doc.end();
};
