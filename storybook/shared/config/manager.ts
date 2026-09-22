import { addons, type API } from 'storybook/manager-api';

let nestedFoldersCollapsed = false;

function collapseNestedFolders(api: API) {
  if (nestedFoldersCollapsed) {
    return;
  }

  nestedFoldersCollapsed = true;
  requestAnimationFrame(() => {
    api.emit('storiesCollapseAll');
  });
}

export function configureSidebar(collapsedRoots: string[]) {
  addons.setConfig({
    sidebar: {
      collapsedRoots,
    },
  });

  addons.register('xyflow/sidebar-collapse', () => {
    addons.add('xyflow/sidebar-collapse/init', {
      type: 'global',
      init(api: API) {
        api.on('setIndex', () => collapseNestedFolders(api));

        if (api.getIndex()) {
          collapseNestedFolders(api);
        }
      },
    });
  });
}
