import { useLocation } from 'react-router-dom';

import Flow from './Flow';

const flowConfigs = import.meta.glob<FlowConfig>('./**/*.ts', { eager: true, import: 'default' });

export default () => {
  const location = useLocation();
  const path = `.${location.pathname.replace('/tests/generic', '')}.ts`;
  const flowConfig = flowConfigs[path];

  if (!flowConfig) {
    return `404: This route doesn't exists.`;
  }

  return <Flow flowConfig={flowConfig} />;
};
