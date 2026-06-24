/**
 * useAttachmentMutations Hook
 *
 * Manages attachment mutations: upload with progress, download via Blob,
 * and delete with confirmation.
 */

import { useCallback, useState } from 'react';
import {
  collaborationService,
  Attachment,
} from '@/api/services/collaboration-service';
import { ApiResponse, UploadProgressCallback } from '@/api/types';
import { getCollaborationErrorMessage } from '@/app/lib/error-messages';

export interface AttachmentMutationsState {
  isUploading: boolean;
  uploadProgress: number;
  isDeleting: boolean;
  error: string | null;
}

export interface UseAttachmentMutationsReturn extends AttachmentMutationsState {
  upload: (
    file: File,
    projectStage?: string,
    onProgress?: UploadProgressCallback
  ) => Promise<Attachment | null>;
  download: (attachment: Attachment) => Promise<void>;
  deleteAttachment: (attachmentId: string) => Promise<boolean>;
  clearError: () => void;
}

export function useAttachmentMutations(
  projectId: string | undefined
): UseAttachmentMutationsReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (
      file: File,
      projectStage?: string,
      onProgress?: UploadProgressCallback
    ): Promise<Attachment | null> => {
      if (!projectId) return null;

      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      try {
        const response: ApiResponse<Attachment> = await collaborationService.uploadAttachment(
          projectId,
          { file, projectStage },
          {
            onProgress: (progress) => {
              setUploadProgress(progress.percentage);
              onProgress?.(progress);
            },
          }
        );
        return response.data;
      } catch (err) {
        setError(getCollaborationErrorMessage(err));
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [projectId]
  );

  const download = useCallback(
    async (attachment: Attachment): Promise<void> => {
      if (!projectId) return;

      setError(null);

      try {
        const response = await collaborationService.downloadAttachment(
          projectId,
          attachment.id,
          { responseType: 'blob' }
        );

        const blob = response.data;
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = attachment.fileName;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
      } catch (err) {
        setError(getCollaborationErrorMessage(err));
      }
    },
    [projectId]
  );

  const deleteAttachment = useCallback(
    async (attachmentId: string): Promise<boolean> => {
      if (!projectId) return false;

      setIsDeleting(true);
      setError(null);

      try {
        await collaborationService.deleteAttachment(projectId, attachmentId);
        return true;
      } catch (err) {
        setError(getCollaborationErrorMessage(err));
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [projectId]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isUploading,
    uploadProgress,
    isDeleting,
    error,
    upload,
    download,
    deleteAttachment,
    clearError,
  };
}

export default useAttachmentMutations;
