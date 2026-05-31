import { Stories } from "@/components/dashboard/stories";

export default function HomePage() {
  return (
    <div className="bg-background min-h-dvh">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Stories />
            {/* TODO: feed */}
          </div>

          <div className="lg:sticky lg:top-8 lg:h-fit">
            {/* TODO: sidebar */}
          </div>
        </div>
      </div>
    </div>
  );
}
