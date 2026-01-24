import React from 'react';

interface AgrofyTableLoadingProps {
  text?: string;
}

export const AgrofyTableLoading: React.FC<AgrofyTableLoadingProps> = ({
  text = 'Loading...'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 relative">
      <div className="w-12 h-12 rounded-full box-border absolute component-loader">
        <div className="effect-1 effects" />
        <div className="effect-2 effects" />
        <div className="effect-3 effects" />
      </div>
      <p className="mt-16 pt-8 text-sm text-gray-500">{text}</p>
    </div>
  );
};
