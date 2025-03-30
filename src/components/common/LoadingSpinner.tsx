/**
 * LoadingSpinner component displays an animated loading indicator.
 * Customizable size and color for different contexts.
 */
import React from 'react';

interface LoadingSpinnerProps {
  /** Size of the spinner: 'sm' (16px), 'md' (32px), or 'lg' (48px) */
  size?: 'sm' | 'md' | 'lg';
  /** Tailwind color class to use for the spinner */
  color?: string;
}

export function LoadingSpinner({ size = 'md', color = 'orange-500' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-${color} border-t-transparent ${sizeClasses[size]}`} />
  );
}