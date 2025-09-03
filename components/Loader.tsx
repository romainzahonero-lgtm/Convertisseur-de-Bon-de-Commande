
import React from 'react';
import Icon from './Icon';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <Icon name="spinner" className="w-16 h-16 text-blue-600 animate-spin" />
        <p className="text-xl font-semibold text-slate-700">{message}</p>
        <p className="text-slate-500">Cela peut prendre quelques instants...</p>
    </div>
  );
};

export default Loader;
