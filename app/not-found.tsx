import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-6 text-paper">
      <div className="w-full max-w-md border border-manila/20 bg-coal/70 p-8">
        <p className="font-mono text-[10px] tracking-[0.28em] text-smoke">
          DIVISION 9 · CASE FILE № 404
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-[0.04em]">
          FILE NOT FOUND
        </h1>
        <p className="mt-3 font-serif text-sm italic text-smoke">
          The drawer&apos;s empty. Somebody got here first.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-12 items-center border border-oxblood/70 bg-oxblood px-5 py-3 font-display text-sm font-semibold tracking-[0.18em] text-paper transition hover:bg-[#a13540]"
        >
          BACK TO THE CASE
        </Link>
      </div>
    </main>
  );
}
