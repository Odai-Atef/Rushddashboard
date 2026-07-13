import { useParams } from "react-router";
import { DonorMatchingDashboard as Dashboard } from "@/app/components/donor-matching/DonorMatchingDashboard";

export function DonorMatchingDashboardPage() {
  return <Dashboard onNavigate={() => {}} />;
}
