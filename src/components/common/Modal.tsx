/**
 * Modal component for displaying content in an overlay.
 * Handles click outside to close and provides consistent styling.
 */
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  /** Modal title displayed in header */
  title: string;
  /** Content to render inside modal */
  children: React.ReactNode;
  /** Function to call when modal should close */
  onClose: () => void;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Size of the modal */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ title, children, onClose, footer, size = 'md' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef}
        className={`bg-white w-full ${sizeClasses[size]} rounded-xl shadow-xl`}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <Button
            variant="secondary"
            size="sm"
            icon={X}
            onClick={onClose}
            className="!p-2"
          />
        </div>
        
        <div className="p-6">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}