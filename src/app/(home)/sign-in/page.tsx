import { SignInButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="text-white">
      <SignInButton forceRedirectUrl={"/drive"} />
      <footer className="mt-16 text-sm text-neutral-500">
        © {new Date().getFullYear()} JL40 Drive. All rights reserved.
      </footer>
    </div>
  );
}
