/**
 * QuickActionCard component for displaying actionable items in the dashboard.
 * Renders a card with an icon, title, and description that can be clicked.
 */
import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  /** Lucide icon component to display */
  icon: LucideIcon;
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** Click handler for the card */
  onClick?: () => void;
}

export function QuickActionCard({ icon: Icon, title, description, onClick }: QuickActionCardProps) {
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-orange-500"
      onClick={onClick}
    >
      <div className="flex items-center">
        <Icon className="h-8 w-8 text-orange-500" />
        <h3 className="ml-3 text-lg font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}