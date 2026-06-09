import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <div className="bg-muted mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground h-10 w-10" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
