import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (!user || user.role !== "admin")
    return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}
