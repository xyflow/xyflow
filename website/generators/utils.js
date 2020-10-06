function filterPublished(post) {
  const isPublished = post.node.frontmatter && post.node.frontmatter.published;
  return process.env.NODE_ENV === 'development' || isPublished;
}

module.exports = {
  filterPublished,
};
