import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderGlobalAction } from '@carbon/react';
import { Close, Search, LocationPerson } from '@carbon/react/icons';
import { isDesktop, navigate, useLayoutType, useOnClickOutside } from '@openmrs/esm-framework';
import ClientRegistryOverlay from '../client-registry-overlay/client-registry-overlay.component';
import styles from './client-registry-icon.scss';
import { useParams, useSearchParams } from 'react-router-dom';

interface ClientRegistryLaunchProps {}

const ClientRegistryLaunch: React.FC<ClientRegistryLaunchProps> = () => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const { page } = useParams();
  const isSearchPage = useMemo(() => page === 'cr', [page]);
  const [searchParams] = useSearchParams();
  const initialSearchTerm = isSearchPage ? searchParams.get('query') : '';

  const handleGlobalAction = useCallback(() => {
    if (isSearchPage) {
      navigate({
        to: window.localStorage.getItem('searchReturnUrl') ?? '${openmrsSpaBase}/',
      });
      window.localStorage.removeItem('searchReturnUrl');
    } else {
      window.localStorage.setItem('searchReturnUrl', window.location.pathname);
      navigate({
        to: `\${openmrsSpaBase}/cr?query=${encodeURIComponent(initialSearchTerm)}`,
      });
    }
  }, [isSearchPage]);

  return (
    <div className={styles.patientSearchIconWrapper}>
      <div className={`${isSearchPage && styles.closeButton}`}>
        <HeaderGlobalAction
          aria-label={t('searchClientRegistry', 'Search Client Registry')}
          aria-labelledby="Search Client Registry"
          className={`${isSearchPage ? styles.activeSearchIconButton : styles.searchIconButton}`}
          name="ClientRegistryIcon"
          onClick={handleGlobalAction}>
          { isSearchPage ? <Close size={20} /> : <LocationPerson size={20} />}
        </HeaderGlobalAction>
      </div>
    </div>
  );
};

export default ClientRegistryLaunch;
