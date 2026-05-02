import Link from "next/link";

export default function ISOAgentPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 md:px-6 py-24 md:py-36 lg:py-50 gap-4">
      <h1 className="text-2xl md:text-3xl text-center">ISO Agent</h1>
      <p className="text-muted-foreground text-center max-w-md text-sm md:text-base">
        Automatically find, validate, and manage Linux distribution ISO
        download links across dozens of distros.
      </p>
      <span className="text-sm text-amber-600 mt-2">Coming Soon</span>
      <Link href="/" className="text-sm text-muted-foreground underline mt-4">
        ← Back to Home
      </Link>
    </div>
  );
}
