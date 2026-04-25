import EmberRouter from '@embroider/router';

import config from 'ember-examples/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('examples', function () {
    this.route('color-mode');
    this.route('parity', function () {
      this.route('viewport-controls');
      this.route('custom-controls');
      this.route('node-adornments');
      this.route('editing');
      this.route('edges');
      this.route('minimap');
      this.route('custom-handles');
      this.route('resizing');
      this.route('placement-events');
    });
  });
  this.route('tests', function () {
    this.route('generic', { path: '/generic/:topic/:example' });
  });
});
