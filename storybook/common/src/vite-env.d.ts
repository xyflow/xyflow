/// <reference types="vite/client" />

// Allow importing CSS files
declare module '*.css' {
  const content: string;
  export default content;
}

