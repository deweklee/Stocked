import Link from "next/link";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth/auth-button";

export function NavBar() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-background">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-base">
            Stocked
          </Link>
          <div className="flex gap-4">
            <Link
              href="/lists"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Lists
            </Link>
          </div>
        </div>
        <Suspense>
          <AuthButton />
        </Suspense>
      </div>
    </nav>
  );
}
