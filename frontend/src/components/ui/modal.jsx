import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { cn } from '@/lib/utils';

const Modal = ({ isOpen, onClose, children, className }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4",
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;