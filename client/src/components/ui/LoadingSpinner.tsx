interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

const LoadingSpinner = ({ size = "md", text }: LoadingSpinnerProps) => {
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }[size];

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={`${sizeClass} border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin`}
      />
      {text && <p className="text-gray-500 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
