import { useParams } from "react-router";
import { MatchAnalysis } from "@/app/components/donor-matching/MatchAnalysis";
import { useNavigate } from "react-router";

export function MatchAnalysisPage() {
  const { donorId } = useParams<{ donorId: string }>();
  const navigate = useNavigate();
  return (
    <MatchAnalysis
      donorId={donorId || '1'}
      onNavigate={(view, id) => {
        if (view === 'submission' && id) {
          navigate(`/dashboard/donor-matching/submission/${id}`);
        } else if (view === 'recommended') {
          navigate('/dashboard/donor-matching/recommended');
        }
      }}
    />
  );
}
