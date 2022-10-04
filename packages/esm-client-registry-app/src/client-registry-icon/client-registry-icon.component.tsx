import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderGlobalAction } from '@carbon/react';
import { Close, Search, LocationPerson } from '@carbon/react/icons';
import { isDesktop, navigate, useLayoutType, useOnClickOutside } from '@openmrs/esm-framework';
import PatientSearchOverlay from '../patient-search-overlay/patient-search-overlay.component';
import styles from './client-registry-icon.scss';
import { useParams, useSearchParams } from 'react-router-dom';

interface ClientRegistryLaunchProps {}

const ClientRegistryLaunch: React.FC<ClientRegistryLaunchProps> = () => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const { page } = useParams();
  const [searchParams] = useSearchParams();
  const initialSearchTerm = searchParams.get('query');
  const isSearchPage = useMemo(() => page === 'search', [page]);

  const [showSearchInput, setShowSearchInput] = useState(false);
  const [canClickOutside, setCanClickOutside] = useState(false);

  const handleGlobalAction = useCallback(() => {
    if (showSearchInput) {
      if (isSearchPage) {
        navigate({
          to: window.localStorage.getItem('searchReturnUrl') ?? '${openmrsSpaBase}/',
        });
        window.localStorage.removeItem('searchReturnUrl');
      }
      setShowSearchInput(false);
    } else {
      setShowSearchInput(true);
    }
  }, [isSearchPage, setShowSearchInput, showSearchInput]);

  const resetToInitialState = useCallback(() => {
    setShowSearchInput(false);
    setCanClickOutside(false);
  }, [setShowSearchInput, setCanClickOutside]);

  useEffect(() => {
    // Search input should always be open when we direct to the search page.
    setShowSearchInput(isSearchPage);
    if (isSearchPage) {
      setCanClickOutside(false);
    }
  }, [isSearchPage]);

  useEffect(() => {
    showSearchInput ? setCanClickOutside(true) : setCanClickOutside(false);
  }, [showSearchInput]);


  return (
    <div className={styles.patientSearchIconWrapper}>
      <PatientSearchOverlay onClose={handleGlobalAction} query={initialSearchTerm} />

      <div className={`${showSearchInput && styles.closeButton}`}>
        <HeaderGlobalAction
          aria-label={t('searchClientRegistry', 'Search Client Registry')}
          aria-labelledby="Search Client Registry"
          className={`${showSearchInput ? styles.activeSearchIconButton : styles.searchIconButton}`}
          name="ClientRegistryIcon"
          onClick={handleGlobalAction}>
          {showSearchInput ? <Close size={20} /> : <LocationPerson size={20} />}
        </HeaderGlobalAction>
      </div>
    </div>
  );
};

export default ClientRegistryLaunch;
