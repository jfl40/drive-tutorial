import { notFound } from "next/navigation";
import { Modal } from "./modal";
import { QUERIES } from "~/server/db/queries";
import { DownloadButton } from "~/components/DownloadButton";

interface FileModalProps {
  params: {
    id: string; // This 'id' comes directly from the dynamic route segment [id]
  };
}

export default async function FileModal({ params }: FileModalProps) {
  const awaitedParams = await Promise.resolve(params);
  const fileId = awaitedParams.id;
  const idAsNumber = parseInt(fileId);
  if (Number.isNaN(idAsNumber)) return notFound();

  const file = await QUERIES.getFileById(idAsNumber);
  if (!file) notFound();

  const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];

  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const isImage = allowedImageTypes.includes(file.type!);

  if (isPdf) {
    return (
      <Modal>
        <iframe src={file.url} title="Modal View" className="h-full w-full" />
      </Modal>
    );
  } else if (isImage) {
    return (
      <Modal>
        <div className="flex h-full items-center justify-center">
          <img
            src={file.url}
            alt="Modal View"
            className="max-h-[80vh] max-w-full object-contain"
          />
        </div>
      </Modal>
    );
  } else {
    // Handle unsupported file types gracefully
    return (
      <Modal>
        <div className="flex h-full items-center justify-center">
          <DownloadButton fileUrl={file.url} fileName={file.name} />{" "}
          {/* Pass file data */}
        </div>
      </Modal>
    );
  }
}
