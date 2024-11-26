import { PDFViewer } from '@react-pdf/renderer';

const InvoicePreview: React.FC<InvoiceTemplate> = (props) => {
  return (
    <div className="h-screen">
      <PDFViewer width="100%" height="100%">
        {generatePDF(props)}
      </PDFViewer>
    </div>
  );
}; 