// `strictTemplates` rejects bare `:data-*` bindings on native elements
// allow them so any element can take plain `:data-foo` attributes without a per-site `v-bind` workaround.
export {};

declare module 'vue' {
  interface HTMLAttributes {
    [key: `data-${string}`]: unknown;
  }
  interface SVGAttributes {
    [key: `data-${string}`]: unknown;
  }
}
