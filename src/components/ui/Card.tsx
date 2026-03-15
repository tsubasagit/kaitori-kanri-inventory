type CardProps = {
  children: React.ReactNode;
  title?: string;
  action?: React.ReactNode;
  className?: string;
};

export function Card({ children, title, action, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-white shadow-sm ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          {title && (
            <h3 className="text-lg font-medium text-foreground">{title}</h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}
