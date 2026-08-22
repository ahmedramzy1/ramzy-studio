// Compatibility module for feature code that historically imported shared
// application state from `@/main`.
//
// IMPORTANT: this file must stay side-effect free. The actual browser app mount
// lives in `app-bootstrap.tsx` so reusable packages such as the portfolio runtime
// can never replace a host application's React root merely by importing a shared
// Studio module.
export { queryClient } from "@/lib/query-client";
