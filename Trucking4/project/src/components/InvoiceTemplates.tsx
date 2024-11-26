import { useState, useEffect } from 'react';
import { supabase } from './../lib/supabase';

interface Template {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
  };
  logo: {
    position: 'left' | 'center' | 'right';
    size: number;
  };
  fonts: {
    header: string;
    body: string;
  };
}

export const InvoiceTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('default');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const { data, error } = await supabase
      .from('invoice_templates')
      .select('*')
      .eq('user_id', supabase.auth.user()?.id);

    if (data) setTemplates(data);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Invoice Template</h3>
      <select 
        value={selectedTemplate}
        onChange={(e) => setSelectedTemplate(e.target.value)}
        className="form-select w-full"
      >
        <option value="default">Default Template</option>
        {templates.map(template => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>

      {/* Template Preview */}
      <div className="border p-4 rounded">
        {/* Show template preview here */}
      </div>
    </div>
  );
}; 