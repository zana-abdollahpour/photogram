"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

export function Sidebar() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="mb-4 flex items-center space-x-3">
          <Image
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop&crop=face"
            alt="Your Profile"
            width={60}
            height={60}
            className="size-14 rounded-full"
            unoptimized // TODO: remove later for real data
          />
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold">{session?.user.email}</div>
            <div className="text-muted-foreground truncate text-sm">
              {session?.user.name}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              title="Sign Out"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
