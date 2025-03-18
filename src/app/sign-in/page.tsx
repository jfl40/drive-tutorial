import { SignInButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-neutral-800 py-4">
      <main className="text-center text-white">
        <SignInButton forceRedirectUrl={"/drive"} />
      </main>
      <footer className="mt-16 text-sm text-neutral-500">
        © {new Date().getFullYear()} T3 Drive-tutorial. All rights reserved.
      </footer>
    </div>
  );
}
