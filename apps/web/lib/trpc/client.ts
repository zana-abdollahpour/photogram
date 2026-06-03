import { AppRouter } from "@repo/trpc/router";
import { QueryClient } from "@tanstack/react-query";
import {
  httpBatchLink,
  createTRPCReact,
  type CreateTRPCReact,
} from "@trpc/react-query";

export const trpc: CreateTRPCReact<AppRouter, object> = createTRPCReact<
  AppRouter,
  object
>();

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});
