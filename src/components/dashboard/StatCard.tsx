/**
 * StatCard component for displaying statistics with an icon and action button.
 * Used in dashboards to show key metrics and provide quick access to related features.
 */
import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  /** Lucide icon component to display */
  icon: LucideIcon;
  /** Card title */
  title: string;
  /** Numerical value to display */
  value: number;
  /** Text for the action button */
  actionText: string;
  /** Click handler for the action button */
  onAction?: () => void;
}

export function StatCard({ icon: Icon, title, value, actionText, onAction }: StatCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-100">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-orange-500" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {value}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <button
            onClick={onAction}
            className="font-medium text-orange-500 hover:text-orange-600"
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
}