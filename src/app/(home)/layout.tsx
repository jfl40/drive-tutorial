export default function HomePage(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-neutral-800 py-4">
      <main className="text-center">{props.children}</main>
    </div>
  );
}
