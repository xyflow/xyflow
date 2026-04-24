import EmberRouter from '@embroider/router';

import config from 'ember-examples/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('examples', function () {
    this.route('color-mode');
  });
  this.route('tests', function () {
    this.route('generic', { path: '/generic/:topic/:example' });
  });
});
