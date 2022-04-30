import React from 'react';
import * as cornerstone3D from '@cornerstonejs/core';
import * as cornerstone3DTools from '@cornerstonejs/tools';
import {
  Enums as cs3DEnums,
  CONSTANTS,
  imageLoadPoolManager,
  imageRetrievalPoolManager,
} from '@cornerstonejs/core';
import { Enums as cs3DToolsEnums } from '@cornerstonejs/tools';
import init from './init.js';
import commandsModule from './commandsModule';
import ToolGroupService from './services/ToolGroupService';
import { toolNames } from './initCornerstoneTools';
import { getEnabledElement } from './state';
import Cornerstone3DViewportService from './services/ViewportService/Cornerstone3DViewportService';

import { id } from './id';

const Component = React.lazy(() => {
  return import(
    /* webpackPrefetch: true */ './Viewport/OHIFCornerstone3DViewport'
  );
});

const OHIFCornerstoneViewport = props => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </React.Suspense>
  );
};

/**
 *
 */
const cornerstone3DExtension = {
  /**
   * Only required property. Should be a unique value across all extensions.
   */
  id,

  onModeExit: () => {
    // Empty out the image load and retrieval pools to prevent memory leaks
    // on the mode exits
    Object.values(cs3DEnums.RequestType).forEach(type => {
      imageLoadPoolManager.clearRequestStack(type);
      imageRetrievalPoolManager.clearRequestStack(type);
    });
  },

  /**
   *
   *
   * @param {object} [configuration={}]
   * @param {object|array} [configuration.csToolsConfig] - Passed directly to `initCornerstoneTools`
   */
  async preRegistration({
    servicesManager,
    commandsManager,
    configuration = {},
    appConfig,
  }) {
    servicesManager.registerService(ToolGroupService(servicesManager));
    await init({ servicesManager, commandsManager, configuration, appConfig });
  },
  getViewportModule({ servicesManager, commandsManager }) {
    const ExtendedOHIFCornerstoneViewport = props => {
      // const onNewImageHandler = jumpData => {
      //   commandsManager.runCommand('jumpToImage', jumpData);
      // };
      const { ToolBarService } = servicesManager.services;

      return (
        <OHIFCornerstoneViewport
          {...props}
          ToolBarService={ToolBarService}
          servicesManager={servicesManager}
          commandsManager={commandsManager}
        />
      );
    };

    return [
      {
        name: 'cornerstone-3d',
        component: ExtendedOHIFCornerstoneViewport,
      },
    ];
  },
  getCommandsModule({ servicesManager, commandsManager, extensionManager }) {
    return commandsModule({
      servicesManager,
      commandsManager,
      extensionManager,
    });
  },
  getUtilityModule({ servicesManager }) {
    return [
      {
        name: 'common',
        exports: {
          getCornerstoneLibraries: () => {
            return { cornerstone3D, cornerstone3DTools };
          },
          getEnabledElement,
          Cornerstone3DViewportService,
        },
      },
      {
        name: 'core',
        exports: {
          Enums: cs3DEnums,
          CONSTANTS,
        },
      },
      {
        name: 'tools',
        exports: {
          toolNames,
          Enums: cs3DToolsEnums,
        },
      },
    ];
  },
};

export default cornerstone3DExtension;
