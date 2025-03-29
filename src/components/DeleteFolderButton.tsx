"use client";

import { useState } from "react";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { deleteFolder } from "~/server/actions";
import { Button } from "~/components/ui/button";

interface DeleteFolderButtonProps {
  folderId: number;
}

export function DeleteFolderButton({ folderId }: DeleteFolderButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const toastId = toast.loading(
      <span className="text-lg">Deleting file...</span>,
    );

    const result = await deleteFolder(folderId);

    toast.dismiss(toastId);

    if (result.success) {
      toast.success(
        <span className="text-lg">Folder deleted successfully!</span>,
      );
    } else {
      toast.error(
        result.error ?? (
          <span className="text-lg">Failed to delete folder.</span>
        ),
      );
    }
    setIsDeleting(false);
  };

  return (
    <Button
      variant="ghost"
      onClick={handleDelete}
      disabled={isDeleting}
      aria-label="Delete Folder"
      size="sm" // Adjust size if needed
    >
      {isDeleting ? (
        <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-gray-100"></span>
      ) : (
        <Trash2Icon size={20} />
      )}
    </Button>
  );
}
