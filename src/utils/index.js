export const isFunction = obj => !!(obj && obj.constructor && obj.call && obj.apply);

export const inInputDOMNode = e => e && e.target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.nodeName);

export const getDimensions = (node = {}) => ({
  width: node.offsetWidth,
  height: node.offsetHeight
});
