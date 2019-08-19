export const isFunction = obj => !!(obj && obj.constructor && obj.call && obj.apply);

export const isInputNode = e => e && e.target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.nodeName);

export const getDimensions = (node) => {
  return {
    width: node.offsetWidth,
    height: node.offsetHeight
  };
};
