import {
  defineConfigSchema,
  fetchCurrentPatient,
  getAsyncLifecycle,
  makeUrl,
  messageOmrsServiceWorker,
  setupDynamicOfflineDataHandler,
} from '@openmrs/esm-framework';
import { configSchema } from './config-schema';

declare var __VERSION__: string;
// __VERSION__ is replaced by Webpack with the version from package.json
const version = __VERSION__;

const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const backendDependencies = {
  'webservices.rest': '^2.2.0',
};

const frontendDependencies = {
  '@openmrs/esm-framework': process.env.FRAMEWORK_VERSION,
};

function setupOpenMRS() {
  const moduleName = '@openmrs/esm-client-registry-app';

  const options = {
    featureName: 'client-registry',
    moduleName,
  };

  defineConfigSchema(moduleName, configSchema);

  return {
    pages: [
      {
        route: /^cr/,
        load: getAsyncLifecycle(() => import('./root.component'), options),
      },
    ],
    extensions: [
      {
        id: 'client-registry-icon',
        slot: 'top-nav-actions-slot',
        order: 1,
        load: getAsyncLifecycle(() => import('./client-registry-icon'), options),
      }
    ],
  };
}

export { backendDependencies, frontendDependencies, importTranslation, setupOpenMRS, version };
