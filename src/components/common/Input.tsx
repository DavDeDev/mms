/**
 * Input component with built-in label, error, and helper text support.
 * Provides consistent styling and behavior for text inputs.
 */
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text to display above input */
  label?: string;
  /** Error message to display below input */
  error?: string;
  /** Helper text to display below input when no error */
  helper?: string;
}

export function Input({ label, error, helper, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2 border border-gray-300 rounded-lg 
          focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
          transition-colors
          ${error ? 'border-red-300' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helper && !error && (
        <p className="text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
}