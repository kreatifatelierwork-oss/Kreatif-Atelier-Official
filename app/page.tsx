import { site } from "@/content/site";

export default function Home() {
  return (
    <main className="grid min-h-svh place-items-center">
      <h1 className="display gold-text text-6xl uppercase tracking-[0.2em]">{site.name}</h1>
    </main>
  );
}
