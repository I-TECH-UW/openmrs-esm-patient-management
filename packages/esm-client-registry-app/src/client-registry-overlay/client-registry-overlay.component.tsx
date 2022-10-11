import { PatientUuid } from "@openmrs/esm-framework";
import debounce from "lodash-es/debounce";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import ClientRegistrySearchComponent from "../client-registry-page/client-registry-search.component";
import ClientRegistrySearchBar from "../client-registry-search-bar/client-registry-search-bar.component";
import Overlay from "../ui-components/overlay";

interface ClientRegistryOverlayProps {
  onClose: () => void;
  query?: string;
  header?: string;
  selectPatientAction?: (PatientUuid) => void;
}

const ClientRegistryOverlay: React.FC<ClientRegistryOverlayProps> = ({
  onClose,
  query = "",
  header,
  selectPatientAction,
}) => {
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

  return (
    <Overlay
      header={header ?? t("searchResults", "Search results")}
      close={onClose}
    >
      <ClientRegistrySearchBar
        initialSearchTerm={query}
        onSubmit={onSearchQueryChange}
        onChange={onSearchQueryChange}
        onClear={handleClear}
      />
      {showSearchResults && (
        <ClientRegistrySearchComponent
          selectPatientAction={selectPatientAction}
          query={searchTerm}
          inTabletOrOverlay
          hidePanel={onClose}
        />
      )}
    </Overlay>
  );
};

export default ClientRegistryOverlay;
