import { notFound } from "next/navigation";
import { DownloadButton } from "~/components/DownloadButton";
import { QUERIES } from "~/server/db/queries";

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

  let file;
  try {
    file = await QUERIES.getFileById(idAsNumber);
  } catch (error) {
    console.error("Error fetching file:", error);
    return notFound();
  }

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
      <iframe src={file.url} title="Modal View" className="h-screen w-screen" />
    );
  } else if (isImage) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black/90">
        <img
          src={file.url}
          alt="Modal View"
          className="max-h-[80vh] max-w-full object-contain"
        />
      </div>
    );
  } else {
    // Handle unsupported file types gracefully
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black/90">
        <DownloadButton fileUrl={file.url} fileName={file.name} />{" "}
        {/* Pass file data */}
      </div>
    );
  }
}
