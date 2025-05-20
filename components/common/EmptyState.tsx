import React from 'react';

interface EmptyStateProps {
  illustration: React.ReactNode;
  title: string;
  description: string;
  trigger?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  illustration,
  title,
  description,
  trigger,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="max-w-xs mb-6">
        {illustration}
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      
      {trigger && (
        <div>
          {trigger}
        </div>
      )}
    </div>
  );
};
