
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md transition-all duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(168,85,247,0.3)] animate-in fade-in zoom-in duration-300">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-6 text-center">
          {title}
        </h2>
        <div className="text-slate-300 text-lg leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
