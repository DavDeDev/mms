/**
 * Select component for dropdown selection with label and error handling.
 * Provides consistent styling and behavior for select inputs.
 */
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Label text to display above select */
  label?: string;
  /** Error message to display below select */
  error?: string;
  /** Helper text to display below select when no error */
  helper?: string;
  /** Array of options to display in select */
  options: Array<{
    value: string;
    label: string;
  }>;
}

export function Select({ label, error, helper, options, className = '', ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-2 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-orange-500 focus:border-orange-500
          transition-colors
          ${error ? 'border-red-300' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helper && !error && (
        <p className="text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
}