import { isDesktop, navigate, useLayoutType } from "@openmrs/esm-framework";
import { debounce } from "lodash-es";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import ClientRegistryOverlay from "../client-registry-overlay/client-registry-overlay.component";
import ClientRegistrySearchBar from "../client-registry-search-bar/client-registry-search-bar.component";
import styles from "./client-registry-page.scss";
import ClientRegistrySearchComponent from "./client-registry-search.component";

interface ClientRegistryPageComponentProps {}

const ClientRegistryPageComponent: React.FC<
  ClientRegistryPageComponentProps
> = () => {
  const [searchParams] = useSearchParams();
  const layout = useLayoutType();

  const query = searchParams?.get("query") ?? "";

  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(query);
  const handleClear = useCallback(() => setSearchTerm(""), [setSearchTerm]);
  const showSearchResults = useMemo(() => !!searchTerm?.trim(), [searchTerm]);

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
    }
  }, [query]);

  const onSearchQueryChange = debounce((val) => {
    setSearchTerm(val);
  }, 300);

  const handleCloseOverlay = useCallback(() => {
    navigate({
      to: window["getOpenmrsSpaBase"](),
    });
  }, []);

  return isDesktop(layout) ? (
    <div className={styles.patientSearchPage}>
      <div className={styles.patientSearchComponent}>
        <ClientRegistrySearchBar
          initialSearchTerm={query}
          onSubmit={onSearchQueryChange}
          onChange={onSearchQueryChange}
          onClear={handleClear}
        />
        <ClientRegistrySearchComponent
          query={query}
          inTabletOrOverlay={!isDesktop(layout)}
          stickyPagination
        />
      </div>
    </div>
  ) : (
    <ClientRegistryOverlay
      onClose={handleCloseOverlay}
      query={searchParams?.get("query") ?? ""}
    />
  );
};

export default ClientRegistryPageComponent;
