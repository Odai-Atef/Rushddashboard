import { useParams } from "react-router";
import { SubmissionPreparation } from "@/app/components/donor-matching/SubmissionPreparation";
import { useNavigate } from "react-router";

export function SubmissionPreparationPage() {
  const { donorId } = useParams<{ donorId: string }>();
  const navigate = useNavigate();
  return (
    <SubmissionPreparation
      donorId={donorId || '1'}
      onNavigate={(view, id) => {
        if (view === 'recommended') {
          navigate('/dashboard/donor-matching/recommended');
        } else if (view === 'analysis' && id) {
          navigate(`/dashboard/donor-matching/analysis/${id}`);
        }
      }}
    />
  );
}
