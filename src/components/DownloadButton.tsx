// components/DownloadButton.tsx
"use client";

interface DownloadButtonProps {
  fileUrl: string;
  fileName: string; // To suggest a filename
}

export function DownloadButton({ fileUrl, fileName }: DownloadButtonProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName; // Suggest a filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
    >
      Download
    </button>
  );
}
