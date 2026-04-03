import React from 'react';
import { AgrofyTableEmptyState } from '../AgrofyTable.types';
import { FileX } from 'lucide-react';

export const AgrofyTableEmpty: React.FC<AgrofyTableEmptyState> = ({
  icon,
  title,
  description
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-gray-100 p-3 mb-4">
        {icon || <FileX className="h-8 w-8 text-gray-400" />}
      </div>
      <h3 className="text-base font-medium text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 text-center max-w-sm">
          {description}
        </p>
      )}
    </div>
  );
};
