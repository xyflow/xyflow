(async () => {
  const replace = await import('replace-in-file');

  const options = {
    files: 'dist/**/*.{js,ts,tsx}',
    from: [/(@xyflow\/react)/g, /(@xyflow\/system)/g],
    to: ['@sweep-io/react', '@sweep-io/system'],
  };

  try {
    const results = await replace.replaceInFile(options);
    console.log('Replacement results:', results);
  } catch (error) {
    console.error('Error occurred:', error);
  }
})();
