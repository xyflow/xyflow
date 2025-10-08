import type { Props } from './data';
import type { Meta } from '@storybook/react';

const argTypes = {} satisfies Record<keyof Props, any>;

export const meta: Meta = {
  title: 'Nodes',
  argTypes,
};

// TODO: implement all of the generic node tests here.
// the tests are run on each framework seperately
export const Default = {
  args: {},
};
