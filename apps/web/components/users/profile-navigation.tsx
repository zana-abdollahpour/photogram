import Link from "next/link";
import { Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ProfileNavigation() {
  return (
    <div className="bg-background sticky top-0 z-10 border-b">
      <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <Home className="h-6 w-6" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
