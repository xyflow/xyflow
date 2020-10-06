export const parseProjectDate = (dateString) => {
  const parts = dateString.split('/');
  return new Date(+parts[0], +parts[1] - 1, +parts[2]);
};

export const groupProjectsByYear = (projects) => {
  return projects.reduce((grouped, project) => {
    const year = project.date.getFullYear();
    grouped[year] = grouped.hasOwnProperty(year)
      ? grouped[year].concat([project])
      : [project];
    return grouped;
  }, {});
};

export const getMainCategory = (categoryArray = []) => {
  const matchingCategory = mainTags.find((mc) =>
    categoryArray.find((cat) => mc.id === cat)
  );

  return matchingCategory ? matchingCategory.id : null;
};

export const shuffleProjects = (projects) => {
  return projects.sort((a, b) => Math.random() - 0.5);
};

export default {
  parseProjectDate,
  groupProjectsByYear,
  getMainCategory,
  shuffleProjects,
};
