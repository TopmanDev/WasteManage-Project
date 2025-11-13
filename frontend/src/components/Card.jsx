// Import React
import React from 'react';

/**
 * Reusable Card component for displaying content in a boxed layout
 * @param {ReactNode} children - Card content
 * @param {string} className - Additional custom classes
 * @param {string} title - Optional card title
 * @param {ReactNode} footer - Optional card footer content
 * @param {boolean} hover - Whether to show hover effect
 */
const Card = ({
  children,
  className = '',
  title,
  footer,
  hover = false,
  ...props
}) => {
  // Base card styles
  const baseStyles = 'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden';

  // Hover effect styles
  const hoverStyles = hover ? 'transition-transform duration-200 hover:shadow-lg hover:-translate-y-1' : '';

  // Combine all styles
  const cardClasses = `${baseStyles} ${hoverStyles} ${className}`;

  return (
    <div className={cardClasses} {...props}>
      {/* Card Header with Title */}
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
      )}

      {/* Card Body */}
      <div className="px-6 py-4">
        {children}
      </div>

      {/* Card Footer */}
      {footer && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
