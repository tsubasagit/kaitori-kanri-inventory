type BadgeProps = {
  children: React.ReactNode;
  color?: string;
  bgColor?: string;
  className?: string;
};

export function Badge({
  children,
  color = "var(--primary)",
  bgColor = "var(--primary-light)",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
      style={{ color, backgroundColor: bgColor }}
    >
      {children}
    </span>
  );
}
