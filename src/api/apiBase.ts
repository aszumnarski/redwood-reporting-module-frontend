export function getApiBase(): string {
    const base = window.location.pathname;
    return base.endsWith("/") ? base + "rest" : base + "/rest";
  }
  