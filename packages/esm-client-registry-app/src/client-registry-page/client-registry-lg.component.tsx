import { R4 } from "@ahryman40k/ts-fhir-types";
import {
  interpolateString,
  navigate,
  useConfig,
  usePagination,
} from "@openmrs/esm-framework";
import isEmpty from "lodash-es/isEmpty";
import React, { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import Pagination from "../ui-components/pagination/pagination.component";
import styles from "./client-registry-lg.scss";
import {
  ClientRegistryResults,
  EmptyQueryIllustration,
  EmptySearchResultsIllustration,
  FetchErrorIllustration,
  LoadingSearchResults,
} from "./client-registry-views";

interface ClientRegistryComponentProps {
  query: string;
  inTabletOrOverlay?: boolean;
  stickyPagination?: boolean;
  selectPatientAction?: (patientUuid: string) => void;
  hidePanel?: () => void;
  searchResults: R4.IBundle_Entry[];
  isLoading: boolean;
  fetchError: Error;
}

const ClientRegistryComponent: React.FC<ClientRegistryComponentProps> = ({
  query,
  stickyPagination,
  selectPatientAction,
  inTabletOrOverlay,
  hidePanel,
  searchResults,
  isLoading,
  fetchError,
}) => {
  const { t } = useTranslation();
  const config = useConfig();
  const resultsToShow = inTabletOrOverlay ? 15 : 5;
  const totalResults = searchResults.length;

  const { results, goTo, totalPages, currentPage, showNextButton, paginated } =
    usePagination(searchResults, resultsToShow);

  useEffect(() => {
    goTo(1);
  }, [query, goTo]);

  const handlePatientSelection = useCallback(
    (evt, patientUuid: string) => {
      evt.preventDefault();
      if (selectPatientAction) {
        selectPatientAction(patientUuid);
      } else {
        navigate({
          to: `${interpolateString(config.search.patientResultUrl, {
            patientUuid: patientUuid,
          })}/${encodeURIComponent(config.search.redirectToPatientDashboard)}`,
        });
      }
      if (hidePanel) {
        hidePanel();
      }
    },
    [config, selectPatientAction, hidePanel]
  );

  const searchResultsView = useMemo(() => {
    if (!query) {
      return <EmptyQueryIllustration inTabletOrOverlay={inTabletOrOverlay} />;
    }

    if (isLoading) {
      return <LoadingSearchResults />;
    }

    if (fetchError) {
      return <FetchErrorIllustration inTabletOrOverlay={inTabletOrOverlay} />;
    }

    if (isEmpty(results)) {
      return (
        <EmptySearchResultsIllustration inTabletOrOverlay={inTabletOrOverlay} />
      );
    }

    return (
      <ClientRegistryResults
        searchResults={results}
        handlePatientSelection={handlePatientSelection}
      />
    );
  }, [
    query,
    isLoading,
    inTabletOrOverlay,
    results,
    handlePatientSelection,
    fetchError,
  ]);

  return (
    <div
      className={`${
        !inTabletOrOverlay
          ? styles.searchResultsDesktop
          : styles.searchResultsTabletOrOverlay
      }`}
    >
      <div className={`${stickyPagination && styles.broadBottomMargin}`}>
        <h2
          className={`${styles.resultsHeader} ${styles.productiveHeading02} ${
            inTabletOrOverlay && styles.leftPaddedResultHeader
          }`}
        >
          {!isLoading
            ? `${totalResults ?? 0} ${t("seachResultsSmall", "search results")}`
            : t("searchingText", "Searching...")}
        </h2>
        {searchResultsView}
      </div>
      {paginated && (
        <div
          className={`${styles.pagination} ${
            stickyPagination && styles.stickyPagination
          }`}
        >
          <Pagination
            setCurrentPage={goTo}
            currentPage={currentPage}
            hasMore={showNextButton}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
};

export default ClientRegistryComponent;
