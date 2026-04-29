import Image from "next/image";
import { healthCheck } from "@/lib/api";
import { AgentCard } from "@/components/AgentCard";
import { BlackHoleCard } from "@/components/BlackHoleCard";


export default async function Home() {
  const data = await healthCheck();
  return (
    <div>
      {/*<p> API STATUS: {data.status} </p>*/}
      <div className="flex flex-col items-center justify-center py-50">
        <h1 className="text-7xl">Hubble</h1>

        <p className="text-center max-w-xl mt-4 text-muted-foreground text-xl">
          AI Agents are a really cool and modern way of automating stuff. You
          really gotta try them out!
        </p>

        <div className="flex flex-row gap-6 mt-10">
          <AgentCard />
          <BlackHoleCard />
        </div>
      </div>
    </div>
  );
}
