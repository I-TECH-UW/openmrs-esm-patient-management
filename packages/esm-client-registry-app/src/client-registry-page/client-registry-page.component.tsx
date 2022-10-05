import React, { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isDesktop, navigate, useLayoutType } from '@openmrs/esm-framework';
import styles from './client-registry-page.scss';
import ClientRegistryOverlay from '../client-registry-overlay/client-registry-overlay.component';
import ClientRegistrySearchComponent from './client-registry-search.component';

interface ClientRegistryPageComponentProps {}

const ClientRegistryPageComponent: React.FC<ClientRegistryPageComponentProps> = () => {
  const [searchParams] = useSearchParams();
  const layout = useLayoutType();

  // If a user directly falls on openmrs/spa/search?query= in a tablet view.
  // On clicking the <- on the overlay should take the user on the home page.
  // P.S. The user will never be directed to the patient search page (above URL) in a tablet view otherwise.
  const handleCloseOverlay = useCallback(() => {
    navigate({
      to: window['getOpenmrsSpaBase'](),
    });
  }, []);

  return isDesktop(layout) ? (
    <div className={styles.patientSearchPage}>
      <div className={styles.patientSearchComponent}>
        <ClientRegistrySearchComponent
          query={searchParams?.get('query') ?? ''}
          inTabletOrOverlay={!isDesktop(layout)}
          stickyPagination
        />
      </div>
    </div>
  ) : (
    <ClientRegistryOverlay onClose={handleCloseOverlay} query={searchParams?.get('query') ?? ''} />
  );
};

export default ClientRegistryPageComponent;
