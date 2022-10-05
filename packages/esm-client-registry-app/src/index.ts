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

  setupDynamicOfflineDataHandler({
    id: 'esm-client-registry-app:patient',
    type: 'patient',
    displayName: 'Client registry search',
    async isSynced(patientUuid) {
      const expectedUrls = [`/ws/fhir2/R4/Patient/${patientUuid}`];
      const absoluteExpectedUrls = expectedUrls.map((url) => window.origin + makeUrl(url));
      const cache = await caches.open('omrs-spa-cache-v1');
      const keys = (await cache.keys()).map((key) => key.url);
      return absoluteExpectedUrls.every((url) => keys.includes(url));
    },
    async sync(patientUuid) {
      await messageOmrsServiceWorker({
        type: 'registerDynamicRoute',
        pattern: `/ws/fhir2/R4/Patient/${patientUuid}`,
      });

      await fetchCurrentPatient(patientUuid);
    },
  });

  return {
    pages: [
      {
        route: /^search/,
        load: getAsyncLifecycle(() => import('./root.component'), options),
      },
    ],
    extensions: [
      {
        id: 'client-registry-icon',
        slot: 'top-nav-actions-slot',
        order: 1,
        load: getAsyncLifecycle(() => import('./client-registry-icon'), options),
      },
      {
        // This extension renders the a Patient-Search Button, which when clicked, opens the search bar in an overlay.
        id: 'client-registry-button',
        slot: 'client-registry-button-slot',
        load: getAsyncLifecycle(() => import('./client-registry-search-button/client-registry-search-button.component'), options),
        offline: true,
      },
    ],
  };
}

export { backendDependencies, frontendDependencies, importTranslation, setupOpenMRS, version };
