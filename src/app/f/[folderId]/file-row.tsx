import type { folders_table, files_table } from "~/server/db/schema";
import { Folder as FolderIcon, FileIcon } from "lucide-react";
import Link from "next/link";
import { DeleteFileButton } from "~/components/DeleteFileButton";
import { DeleteFolderButton } from "~/components/DeleteFolderButton";

export function FileRow(props: { file: typeof files_table.$inferSelect }) {
  const { file } = props;
  return (
    <li
      key={file.id}
      className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <Link href={`/file/${file.id}`} className="flex items-center">
            <FileIcon className="mr-3" size={20} />
            {file.name}
          </Link>
        </div>
        <div className="col-span-2 text-gray-400">{file.type}</div>
        <div className="col-span-3 text-gray-400">{file.size}</div>
        <div className="col-span-1 flex justify-center text-gray-400">
          <DeleteFileButton fileId={file.id} />
        </div>
      </div>
    </li>
  );
}

export function FolderRow(props: {
  folder: typeof folders_table.$inferSelect;
}) {
  const { folder } = props;
  return (
    <li
      key={folder.id}
      className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <Link
            href={`/f/${folder.id}`}
            className="flex items-center text-gray-100 hover:text-blue-400"
          >
            <FolderIcon className="mr-3" size={20} />
            {folder.name}
          </Link>
        </div>
        <div className="col-span-2 text-gray-400"></div>
        <div className="col-span-3 text-gray-400"></div>
        <div className="col-span-1 flex justify-center text-gray-400">
          <DeleteFolderButton folderId={folder.id} />
        </div>
      </div>
    </li>
  );
}
