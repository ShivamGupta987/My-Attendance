// Reusable loading components with beautiful animations

export const LoadingSpinner = ({ size = "default" }: { size?: "small" | "default" | "large" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-6 h-6", 
    large: "w-8 h-8"
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`loading-spinner ${sizeClasses[size]}`}></div>
    </div>
  );
};

export const LoadingDots = ({ size = "default" }: { size?: "small" | "default" | "large" }) => {
  const sizeClasses = {
    small: "w-1 h-1",
    default: "w-2 h-2",
    large: "w-3 h-3"
  };

  return (
    <div className="loading-dots">
      <div className={sizeClasses[size]}></div>
      <div className={sizeClasses[size]}></div>
      <div className={sizeClasses[size]}></div>
    </div>
  );
};

export const LoadingPulse = ({ size = "default" }: { size?: "small" | "default" | "large" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-8 h-8",
    large: "w-12 h-12"
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`loading-pulse ${sizeClasses[size]}`}></div>
    </div>
  );
};

export const LoadingCard = () => (
  <div className="card-soft p-6 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-muted rounded-lg"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

export const LoadingButton = ({ children, isLoading, ...props }: {
  children: React.ReactNode;
  isLoading: boolean;
  [key: string]: any;
}) => (
  <button {...props} disabled={isLoading || props.disabled}>
    {isLoading ? <LoadingDots size="small" /> : children}
  </button>
);