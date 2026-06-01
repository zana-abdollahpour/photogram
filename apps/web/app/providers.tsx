import { ThemeProvider } from "@/providers/theme-provider";

export default function Providers({ children }: React.PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
