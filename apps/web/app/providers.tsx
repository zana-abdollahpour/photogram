import { ThemeProvider } from "@/providers/theme-provider";
import { TrpcProvider } from "@/providers/trpc-provider";

export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider>
      <TrpcProvider>{children}</TrpcProvider>
    </ThemeProvider>
  );
}
