/**
 * Card component for displaying content in a consistent container.
 * Supports header with icon, optional action button, and custom content.
 */
import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface CardProps {
  /** Card title displayed in header */
  title: string;
  /** Content to render inside card */
  children: React.ReactNode;
  /** Optional Lucide icon to display in header */
  icon?: LucideIcon;
  /** Optional action button configuration */
  action?: {
    text: string;
    onClick: () => void;
  };
  /** Additional CSS classes to apply */
  className?: string;
}

export function Card({ title, children, icon: Icon, action, className = '' }: CardProps) {
  return (
    <div className={`bg-white overflow-hidden shadow-lg rounded-lg border border-gray-100 ${className}`}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {Icon && <Icon className="h-6 w-6 text-orange-500 mr-3" />}
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
        </div>
        {children}
      </div>
      {action && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <button
              onClick={action.onClick}
              className="font-medium text-orange-500 hover:text-orange-600"
            >
              {action.text}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}