type BadgeVariant = "success" | "warning" | "danger" | "info" | "default";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantClass: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  default: "bg-gray-100 text-gray-700",
};

const Badge = ({ label, variant = "default" }: BadgeProps) => {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${variantClass[variant]}`}
    >
      {label}
    </span>
  );
};

export default Badge;
