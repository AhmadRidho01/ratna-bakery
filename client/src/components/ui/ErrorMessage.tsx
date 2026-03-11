interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <p className="text-red-500 text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
