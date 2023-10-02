// Template for ALL endpoints serving the code snippets
// No need to edit these inside /src/routes/**
// Will be overwritten by "pnpm run create:endpoints"

import { json } from '@sveltejs/kit';

export function POST() {
  const files = import.meta.glob(['./*.js', './*.ts', './*.svelte', './*css', '!**/+server.ts'], {
    as: 'raw',
    eager: true
  });

  // Loose ./ for each filename
  // +page.svelte becomes App.svelte for correct display in Sandpack
  const filesClean: { [key: string]: string } = Object.entries(files).reduce(
    (filesCleanAcc: { [key: string]: string }, [filename, file]) => {
      if (filename === './+page.svelte') {
        filesCleanAcc['App.svelte'] = file;
      } else {
        filesCleanAcc[filename.replace('./', '')] = file;
      }

      return filesCleanAcc;
    },
    {}
  );

  return json(filesClean);
}
