import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import LocationInput from '../maps/LocationInput';
import RouteMap from '../maps/RouteMap';

interface EditLoadModalProps {
  loadId: string;
  onClose: () => void;
  onUpdate: () => void;
}

const EditLoadModal: React.FC<EditLoadModalProps> = ({ loadId, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<LoadFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoad = async () => {
      const { data, error } = await supabase
        .from('loads')
        .select('*')
        .eq('id', loadId)
        .single();

      if (error) {
        setError(error.message);
        return;
      }

      setFormData(data);
    };

    fetchLoad();
  }, [loadId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('loads')
        .update(formData!)
        .eq('id', loadId);

      if (error) throw error;

      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Similar form fields as PostLoad */}
          {/* ... */}
        </form>
      </div>
    </div>
  );
}; 