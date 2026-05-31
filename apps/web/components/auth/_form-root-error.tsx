import { cn } from "@/lib/utils";

export function FormRootError({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-root-error"
      className={cn(
        "bg-destructive/10 border-destructive/20 text-destructive rounded-md border px-4 py-3 text-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
