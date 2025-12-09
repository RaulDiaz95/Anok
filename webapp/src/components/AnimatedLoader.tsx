type AnimatedLoaderProps = {
  label?: string;
  className?: string;
};

export function AnimatedLoader({ label, className = "" }: AnimatedLoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="eq-loader">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      {label && <p className="text-sm text-gray-400">{label}</p>}
    </div>
  );
}
