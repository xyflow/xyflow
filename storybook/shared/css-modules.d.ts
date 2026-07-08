import type { CSSModuleClasses } from 'vite/client';

declare module '*.module.css' {
  const classes: CSSModuleClasses;
  export default classes;
}
