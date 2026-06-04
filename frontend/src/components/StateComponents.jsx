import { Loader2, AlertCircle, Inbox, RefreshCw } from 'lucide-react';

/**
 * LoadingState Component
 * Displays a spinner or skeleton loaders for lists/cards.
 */
export function LoadingState({ type = 'spinner', message = 'Loading...', count = 4 }) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {[...Array(count)].map((_, i) => (
          <div 
            key={i} 
            className="bg-white/80 dark:bg-gray-800/40 rounded-2xl p-5 border border-slate-200/60 dark:border-gray-700/30 shadow-md animate-pulse"
          >
            {/* Image Placeholder */}
            <div className="w-full aspect-square bg-slate-200 dark:bg-gray-700/50 rounded-xl mb-4"></div>
            {/* Title Placeholder */}
            <div className="h-4 bg-slate-200 dark:bg-gray-700/50 rounded w-2/3 mb-2"></div>
            {/* Price Placeholder */}
            <div className="h-3 bg-slate-200 dark:bg-gray-700/50 rounded w-1/2 mb-4"></div>
            {/* Button/Action Placeholder */}
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 bg-slate-200 dark:bg-gray-700/50 rounded w-1/4"></div>
              <div className="h-10 bg-slate-200 dark:bg-gray-700/50 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4 w-full">
        {[...Array(count)].map((_, i) => (
          <div 
            key={i} 
            className="flex flex-col sm:flex-row gap-5 p-5 bg-white/80 dark:bg-gray-800/40 border border-slate-200/60 dark:border-gray-700/30 rounded-2xl shadow-md animate-pulse"
          >
            {/* Thumbnail Placeholder */}
            <div className="w-24 h-24 bg-slate-200 dark:bg-gray-700/50 rounded-xl shrink-0 mx-auto sm:mx-0"></div>
            {/* Content Placeholders */}
            <div className="flex-1 space-y-3 py-1">
              <div className="h-5 bg-slate-200 dark:bg-gray-700/50 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-gray-700/50 rounded w-1/2"></div>
              <div className="h-6 bg-slate-200 dark:bg-gray-700/50 rounded w-1/4 mt-4"></div>
            </div>
            {/* Controls Placeholder */}
            <div className="flex sm:flex-col justify-between items-end shrink-0 gap-4">
              <div className="h-8 bg-slate-200 dark:bg-gray-700/50 rounded w-8"></div>
              <div className="h-10 bg-slate-200 dark:bg-gray-700/50 rounded w-28"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 w-full text-center">
      <div className="relative w-16 h-16 mb-4">
        <Loader2 className="w-16 h-16 text-cyan-500 animate-spin absolute inset-0" />
      </div>
      <p className="text-cyan-700 dark:text-cyan-200 text-lg font-medium">
        {message}
      </p>
      <p className="text-slate-500 dark:text-gray-400 text-sm mt-2">
        Please wait a moment...
      </p>
    </div>
  );
}

/**
 * EmptyState Component
 * Displays a clean card explaining that no items were found.
 */
export function EmptyState({ 
  icon: Icon = Inbox, 
  title = "No items found", 
  description = "There are no items to display at the moment.", 
  actionText, 
  onAction 
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white/90 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-gray-700/50 max-w-lg mx-auto shadow-xl">
      <div className="w-20 h-20 bg-slate-100 dark:bg-gray-750/30 rounded-full flex items-center justify-center mb-6 border border-slate-200/50 dark:border-gray-700/30 shadow-inner">
        <Icon className="w-10 h-10 text-slate-400 dark:text-gray-500" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-gray-400 mb-8 max-w-xs leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl shadow-lg shadow-cyan-500/20 font-semibold transition-all duration-300 hover:scale-102 hover:shadow-cyan-500/30 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

/**
 * ErrorState Component
 * Displays an error card with a retry action button.
 */
export function ErrorState({ 
  title = "Unable to load data", 
  message = "A network error occurred. Please check your connection and try again.", 
  onRetry 
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-red-500/5 dark:bg-red-500/5 backdrop-blur-md rounded-2xl border border-red-500/20 max-w-lg mx-auto shadow-xl">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-6 border border-red-200 dark:border-red-900/30">
        <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-gray-400 mb-8 max-w-xs leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-102 shadow-md border border-slate-700/50 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 animate-hover-spin" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
