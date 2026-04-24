declare module 'ember-examples/config/environment' {
  const config: {
    modulePrefix: string;
    podModulePrefix?: string;
    locationType: string;
    rootURL: string;
    APP: Record<string, unknown>;
  } & Record<string, unknown>;

  export default config;
}
