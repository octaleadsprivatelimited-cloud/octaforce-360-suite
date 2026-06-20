import "@tanstack/react-router";

declare module "@tanstack/react-router" {
  interface RouteOptions {
    head?: () => {
      meta?: Array<Record<string, string>>;
      links?: Array<Record<string, string>>;
    };
  }
}
