import { useParams } from "react-router";
import { AIRecommendedDonors } from "@/app/components/donor-matching/AIRecommendedDonors";
import { useProjectDonorMatching } from "@/api/hooks/useProjectDonorMatching";
import { useProjectDetails } from "@/api/hooks/useProjectDetails";
import { RoleRouteGuard } from "@/app/components/RoleRouteGuard";
import { MENU_ITEMS_FOR_GUARD } from "@/app/components/RoleRouteGuard/menuItems";

export function AIRecommendedDonorsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { matchData, isMatching, error, refetch } = useProjectDonorMatching(projectId);
  const { project, isLoading: isLoadingProject, error: projectError } = useProjectDetails(projectId);

  return (
    <RoleRouteGuard menuItems={MENU_ITEMS_FOR_GUARD}>
      <AIRecommendedDonors
        project={project}
        isLoadingProject={isLoadingProject}
        projectError={projectError}
        matchData={matchData}
        isMatching={isMatching}
        error={error}
        refetch={refetch}
      />
    </RoleRouteGuard>
  );
}
