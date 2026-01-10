import { AuthButton } from "@/components/auth/auth-button";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="font-semibold">Stocked</div>
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Welcome to Stocked</h1>
      </div>
    </main>
  );
}
