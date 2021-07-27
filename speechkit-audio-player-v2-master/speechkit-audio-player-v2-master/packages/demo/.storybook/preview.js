import { addParameters } from '@storybook/html';

addParameters({
  docs: {
    iframeHeight: 200,
  },
  options: {
    storySort: (a, b) =>
      a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
});

export const parameters = {
  previewTabs: {
    canvas: {
      hidden: true,
    },
    docs: {
      hidden: false,
    }
  },
  options: {
    showRoots: true,
  },
  dependencies: {
    // display only dependencies/dependents that have a story in storybook
    // by default this is false
    withStoriesOnly: true,

    // completely hide a dependency/dependents block if it has no elements
    // by default this is false
    hideEmpty: true,
  },
};
