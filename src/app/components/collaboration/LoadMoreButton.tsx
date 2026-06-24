import { ChevronDown, Loader2 } from 'lucide-react';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
}

export function LoadMoreButton({
  onClick,
  isLoading = false,
  disabled = false,
  label = 'تحميل المزيد',
}: LoadMoreButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full py-3 flex items-center justify-center gap-2 rounded-lg border transition-colors ${
        isDisabled
          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
          : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
      }`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>جاري التحميل...</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <ChevronDown className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
