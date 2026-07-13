import { useParams } from "react-router";
import { AIRecommendedDonors } from "@/app/components/donor-matching/AIRecommendedDonors";
import { useProjectDonorMatching } from "@/api/hooks/useProjectDonorMatching";
import { useProjectDetails } from "@/api/hooks/useProjectDetails";

export function AIRecommendedDonorsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { matchData, isMatching, error } = useProjectDonorMatching(projectId);
  const { project, isLoading: isLoadingProject, error: projectError } = useProjectDetails(projectId);

  return (
    <AIRecommendedDonors
      project={project}
      isLoadingProject={isLoadingProject}
      projectError={projectError}
      matchData={matchData}
      isMatching={isMatching}
      error={error}
    />
  );
}
