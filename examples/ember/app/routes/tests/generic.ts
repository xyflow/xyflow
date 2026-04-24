import Route from '@ember/routing/route';

import { genericTestConfigs } from 'ember-examples/generic-tests';

export default class TestsGenericRoute extends Route {
  model(params: Record<string, unknown>) {
    let topic = String(params.topic);
    let example = String(params.example);
    let key = `${topic}/${example}`;
    let config = genericTestConfigs[key];

    if (!config) {
      throw new Error(`No EmberFlow generic test config found for ${key}`);
    }

    return config;
  }
}
