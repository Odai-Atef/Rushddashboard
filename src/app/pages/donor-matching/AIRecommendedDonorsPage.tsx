import { AIRecommendedDonors } from "@/app/components/donor-matching/AIRecommendedDonors";
import { useNavigate } from "react-router";
import { useAIMatching } from "@/api/hooks/useAIMatching";

export function AIRecommendedDonorsPage() {
  const navigate = useNavigate();
  const {
    projects,
    isLoadingProjects,
    projectError,
    selectedProjectId,
    matchData,
    isMatching,
    error,
    selectProject,
    executeMatch,
  } = useAIMatching();

  return (
    <AIRecommendedDonors
      projects={projects}
      selectedProjectId={selectedProjectId}
      onSelectProject={selectProject}
      onExecuteMatch={executeMatch}
      matchData={matchData}
      isMatching={isMatching}
      isLoadingProjects={isLoadingProjects}
      error={error || projectError}
      onNavigate={(view, donorId) => {
        if (view === 'analysis' && donorId) {
          navigate(`/dashboard/donor-matching/analysis/${donorId}`);
        } else if (view === 'submission' && donorId) {
          navigate(`/dashboard/donor-matching/submission/${donorId}`);
        }
      }}
    />
  );
}
