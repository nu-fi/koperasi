// components/SensitiveField.jsx
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Assuming you use Lucide icons

const SensitiveField = ({ label, value }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Function to mask data (Keep first 4 and last 3 visible)
  const getMaskedValue = (val) => {
    if (!val) return "N/A";
    const str = String(val);

    if (str.length < 8) return "********"; 
    
    const firstPart = str.substring(0, 4);
    const lastPart = str.substring(str.length - 3);
    return `${firstPart}********${lastPart}`;
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm">
        <span className="font-mono text-gray-900">
          {isVisible ? value : getMaskedValue(value)}
        </span>
        
        <button 
          onClick={() => setIsVisible(!isVisible)}
          className="text-gray-500 hover:text-indigo-600 focus:outline-none"
          type="button"
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default SensitiveField;