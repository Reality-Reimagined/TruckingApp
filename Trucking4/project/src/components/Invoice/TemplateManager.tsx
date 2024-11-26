interface CustomTemplate {
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
  layout: 'standard' | 'modern' | 'minimal';
}

const saveTemplate = (template: CustomTemplate) => {
  // Save custom template preferences
}; 