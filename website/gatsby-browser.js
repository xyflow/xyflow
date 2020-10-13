import 'babel-polyfill';
import './src/styles/global.css';

export const onRouteUpdate = () => {
  document.body.classList.remove('noscroll');
};
