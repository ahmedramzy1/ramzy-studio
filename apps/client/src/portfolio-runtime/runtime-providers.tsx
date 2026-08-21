import "@mantine/core/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@/styles/a11y-overrides.css";
import "@/features/editor/styles/index.css";

import React, { type ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mantineCssResolver, theme } from "@/theme";
import "@/i18n";

const portfolioQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export function PortfolioRuntimeProviders({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} cssVariablesResolver={mantineCssResolver}>
      <ModalsProvider>
        <QueryClientProvider client={portfolioQueryClient}>
          <Notifications position="bottom-center" limit={3} zIndex={10000} />
          {children}
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
