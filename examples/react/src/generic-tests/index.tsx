import { useLocation } from 'react-router-dom';
import Flow from './Flow';

export default () => {
  const location = useLocation();
  const files = import.meta.glob<GenericTestCase>('./**/*.ts', { eager: true, import: 'default' });

  const testCasePath = `.${location.pathname.replace('/tests/generic', '')}.ts`;

  const testCase = files[testCasePath];

  if (!testCase) {
    return <div></div>;
  }

  return <Flow generics={testCase} />;
};
