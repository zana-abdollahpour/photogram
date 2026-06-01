"use client";

import Image from "next/image";

import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth/client";

export function Sidebar() {
  const { data: session } = authClient.useSession();

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
        </div>
      </Card>
    </div>
  );
}
