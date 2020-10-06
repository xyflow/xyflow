const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({
  auth: 'f5e6f805ea497290e162230f0e319ed7fde11cab',
});

const outputPath = path.resolve(__dirname, '..', 'src/assets/data/github.json');

const getRepos = async () => {
  const repos = await octokit.repos.listForOrg({
    org: 'wbkd',
    per_page: 100,
    sort: 'created',
  });

  return repos.data;
};

const getData = async (repos) => {
  return Promise.all(
    repos.map(async (repo) => {
      const stats = await octokit.repos.getCommitActivityStats({
        owner: 'wbkd',
        repo: repo.name,
      });

      return {
        repo: repo.name,
        stats: stats.data,
      };
    })
  );
};

const formatYearlyStats = (stats) => {
  return stats.reduce((year, current) => {
    return year.concat(current.days);
  }, []);
};

const formatData = (data) => {
  return data
    .reduce((result, repoData) => {
      if (repoData.stats) {
        result.push(formatYearlyStats(repoData.stats));
      }

      return result;
    }, [])
    .filter((values) => values.some((value) => value > 0))
    .map((values) =>
      values.reduce((result, value, i) => {
        if (value > 0) {
          result.push([i, value]);
        }
        return result;
      }, [])
    )
    .map((values) => ({ v: values }));
};

(async () => {
  const repos = await getRepos();
  const data = await getData(repos);
  const outputData = formatData(data);

  console.log(outputData);

  fs.writeFileSync(outputPath, JSON.stringify(outputData));
})();
