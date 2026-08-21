export interface PortfolioRuntimeHostConfig {
  apiUrl: string;
  collaborationUrl?: string;
  accessToken?: string;
}

let activePortfolioRuntimeConfig: PortfolioRuntimeHostConfig | null = null;

/**
 * Configure the Docmost client services while the portfolio engine is mounted
 * in an external host such as ahmedramzy.com. Standalone Ramzy Studio leaves
 * this unset and continues using its normal same-origin cookie/API behaviour.
 *
 * Public readonly surfaces only need apiUrl; editable surfaces additionally
 * provide the short-lived access/collaboration credentials.
 */
export function setPortfolioRuntimeHostConfig(
  config: PortfolioRuntimeHostConfig,
): () => void {
  const normalized: PortfolioRuntimeHostConfig = {
    apiUrl: config.apiUrl.replace(/\/+$/, ''),
    collaborationUrl: config.collaborationUrl,
    accessToken: config.accessToken,
  };

  activePortfolioRuntimeConfig = normalized;

  return () => {
    if (activePortfolioRuntimeConfig === normalized) {
      activePortfolioRuntimeConfig = null;
    }
  };
}

export function getPortfolioRuntimeHostConfig(): PortfolioRuntimeHostConfig | null {
  return activePortfolioRuntimeConfig;
}

export function isPortfolioRuntimeHost(): boolean {
  return activePortfolioRuntimeConfig !== null;
}
