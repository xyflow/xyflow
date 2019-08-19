export const isFunction = obj => !!(obj && obj.constructor && obj.call && obj.apply);

export const getDimensions = (node) => {
  return {
    width: node.offsetWidth,
    height: node.offsetHeight
  };
};
