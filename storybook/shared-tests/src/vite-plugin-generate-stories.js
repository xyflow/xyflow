import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

/**
 * Vite plugin to generate framework-specific story files from shared tests
 *
 * This plugin watches all folders in the src directory and generates stories for
 * any .stories.ts files found within those folders. It supports both React and Svelte
 * frameworks and automatically regenerates stories when files change.
 *
 * @param {Object} options - Plugin options
 * @param {'react' | 'svelte'} options.framework - Target framework
 * @param {string} options.sharedTestsPath - Path to shared-tests/src directory
 * @param {string} options.outputPath - Path to output directory (shared folder)
 */
export function generateStoriesPlugin(options) {
  const { framework, sharedTestsPath, outputPath } = options;

  let isServing = false;

  /**
   * Parse a stories file to extract exported story names
   */
  function parseStoryExports(content) {
    // Match all export statements (export const ...)
    const exportMatches = content.matchAll(/export\s+const\s+(\w+)\s*=/g);
    const exports = [];

    for (const match of exportMatches) {
      const exportName = match[1];
      // Skip 'meta' as it's handled separately
      if (exportName !== 'meta') {
        exports.push(exportName);
      }
    }

    return exports;
  }

  /**
   * Generate React story file content
   */
  function generateReactStory(storyPath, storyDir, exports) {
    const title = `React Flow/${storyDir}`;
    const flowImport = `storybook-shared-tests/${storyDir}/Flow.tsx`;
    const storiesImport = `storybook-shared-tests/${storyDir}/${path.basename(storyPath)}`;

    const exportStatements = exports.map((name) => `export const ${name} = stories.${name};`).join('\n');

    return `import Flow from '${flowImport}';
import * as stories from '${storiesImport}';

const meta = {
  ...stories.meta,
  title: '${title}',
  component: Flow,
};
export default meta;

${exportStatements}
`;
  }

  /**
   * Generate Svelte story file content
   */
  function generateSvelteStory(storyPath, storyDir, exports) {
    const title = `Svelte Flow/${storyDir}`;
    const flowImport = `storybook-shared-tests/${storyDir}/Flow.svelte`;
    const storiesImport = `storybook-shared-tests/${storyDir}/${path.basename(storyPath)}`;

    const exportStatements = exports.map((name) => `export const ${name} = stories.${name};`).join('\n');

    return `import Flow from '${flowImport}';
import * as stories from '${storiesImport}';

const meta = {
  ...stories.meta,
  title: '${title}',
  component: Flow,
};
export default meta;

${exportStatements}
`;
  }

  /**
   * Generate story file for the given framework
   */
  function generateStoryFile(storyPath, storyDir) {
    try {
      // Read the original stories file
      const content = fs.readFileSync(storyPath, 'utf-8');

      // Parse exports
      const exports = parseStoryExports(content);

      // Use the directory name as the output file name (flat structure)
      const outputFile = path.join(outputPath, storyDir + '.stories.' + (framework === 'react' ? 'tsx' : 'ts'));

      // If no exports found, delete the generated file if it exists
      if (exports.length === 0) {
        if (fs.existsSync(outputFile)) {
          fs.unlinkSync(outputFile);
          if (isServing) {
            console.log(
              `[generate-stories] Deleted ${framework} story (no exports): ${path.relative(process.cwd(), outputFile)}`
            );
          }
        }
        return;
      }

      // Generate content based on framework
      const generatedContent =
        framework === 'react'
          ? generateReactStory(storyPath, storyDir, exports)
          : generateSvelteStory(storyPath, storyDir, exports);

      // Ensure output directory exists
      fs.mkdirSync(outputPath, { recursive: true });

      // Write the generated file
      fs.writeFileSync(outputFile, generatedContent, 'utf-8');

      if (isServing) {
        console.log(`[generate-stories] Generated ${framework} story: ${path.relative(process.cwd(), outputFile)}`);
      }
    } catch (error) {
      console.error(`Error generating story for ${storyPath}:`, error);
    }
  }

  /**
   * Clean up old generated story files and directories
   */
  function cleanupOldStories() {
    try {
      if (!fs.existsSync(outputPath)) {
        return;
      }

      // Remove all existing files and subdirectories in the output path
      const entries = fs.readdirSync(outputPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(outputPath, entry.name);
        if (entry.isDirectory()) {
          fs.rmSync(fullPath, { recursive: true, force: true });
        } else if (entry.isFile() && (entry.name.endsWith('.stories.tsx') || entry.name.endsWith('.stories.ts'))) {
          fs.unlinkSync(fullPath);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old stories:', error);
    }
  }

  /**
   * Scan shared-tests directory and generate all story files
   */
  function generateAllStories() {
    try {
      // Clean up old generated files first
      cleanupOldStories();

      // Read all subdirectories in shared-tests/src
      const entries = fs.readdirSync(sharedTestsPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const dirPath = path.join(sharedTestsPath, entry.name);

          // Find all .stories.ts files in this directory
          const files = fs.readdirSync(dirPath, { withFileTypes: true });
          const storyFiles = files
            .filter((file) => file.isFile() && file.name.endsWith('.stories.ts'))
            .map((file) => path.join(dirPath, file.name));

          // Generate story file for each .stories.ts file found
          for (const storiesFile of storyFiles) {
            generateStoryFile(storiesFile, entry.name);
          }
        }
      }

      console.log(`[generate-stories] Generated all ${framework} stories`);
    } catch (error) {
      console.error('Error generating stories:', error);
    }
  }

  return {
    name: `generate-stories-${framework}`,

    // Generate stories on build start
    buildStart() {
      generateAllStories();
    },

    // Watch for changes in shared-tests directory
    configureServer(server) {
      isServing = true;

      // Generate stories on server start
      generateAllStories();

      // Watch for file changes
      const watcher = server.watcher;

      watcher.on('change', (filePath) => {
        // Check if the changed file is a stories file in shared-tests
        if (filePath.includes('shared-tests/src') && filePath.endsWith('.stories.ts')) {
          const relativePath = path.relative(sharedTestsPath, filePath);
          const dirName = path.dirname(relativePath);

          if (dirName !== '.') {
            generateStoryFile(filePath, dirName);
          }
        }
        // Also watch for Flow component changes to trigger regeneration of all stories in that directory
        else if (filePath.includes('shared-tests/src') && (filePath.endsWith('.tsx') || filePath.endsWith('.svelte'))) {
          const relativePath = path.relative(sharedTestsPath, filePath);
          const dirName = path.dirname(relativePath);

          if (dirName !== '.') {
            // Find all .stories.ts files in this directory and regenerate them
            const dirPath = path.join(sharedTestsPath, dirName);
            try {
              const files = fs.readdirSync(dirPath, { withFileTypes: true });
              const storyFiles = files
                .filter((file) => file.isFile() && file.name.endsWith('.stories.ts'))
                .map((file) => path.join(dirPath, file.name));

              for (const storiesFile of storyFiles) {
                generateStoryFile(storiesFile, dirName);
              }
            } catch (error) {
              console.error(`Error reading directory ${dirPath}:`, error);
            }
          }
        }
      });

      watcher.on('add', (filePath) => {
        // Handle new stories files
        if (filePath.includes('shared-tests/src') && filePath.endsWith('.stories.ts')) {
          const relativePath = path.relative(sharedTestsPath, filePath);
          const dirName = path.dirname(relativePath);

          if (dirName !== '.') {
            generateStoryFile(filePath, dirName);
          }
        }
        // Handle new directories
        else if (filePath.includes('shared-tests/src')) {
          const relativePath = path.relative(sharedTestsPath, filePath);
          const dirName = path.dirname(relativePath);

          // If a new file was added to a directory, check if there are stories to generate
          if (dirName !== '.') {
            const dirPath = path.join(sharedTestsPath, dirName);
            try {
              const files = fs.readdirSync(dirPath, { withFileTypes: true });
              const storyFiles = files
                .filter((file) => file.isFile() && file.name.endsWith('.stories.ts'))
                .map((file) => path.join(dirPath, file.name));

              for (const storiesFile of storyFiles) {
                generateStoryFile(storiesFile, dirName);
              }
            } catch (error) {
              // Directory might not exist yet, ignore
            }
          }
        }
      });
    },
  };
}
