import React, { useEffect, useMemo, useState } from 'react';
import { useClientRegistrySearch, useGetPatientAttributePhoneUuid, usePatientSearchInfinite } from '../client-registry-search.resource';
import { AdvancedPatientSearchState } from '../types';
import styles from './advanced-patient-search.scss';
import { initialState } from './advanced-search-reducer';
import PatientSearchComponent from './patient-search-lg.component';
import RefineSearch from './refine-search.component';

interface ClientRegistrySearchProps {
  query: string;
  inTabletOrOverlay?: boolean;
  stickyPagination?: boolean;
  selectPatientAction?: (patientUuid: string) => void;
  hidePanel?: () => void;
}

const ClientRegistrySearchComponent: React.FC<ClientRegistrySearchProps> = ({
  query,
  stickyPagination,
  selectPatientAction,
  inTabletOrOverlay,
  hidePanel,
}) => {
  const [filters, setFilters] = useState<AdvancedPatientSearchState>(initialState);
  const filtersApplied = useMemo(() => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (value != initialState[key]) {
        count++;
      }
    });
    return count;
  }, [filters]);

  const {
    data: searchResults,
    hasMore,
    isLoading,
    fetchError,
  } = useClientRegistrySearch(query, !!query);

  const filteredResults = useMemo(() => {
    if (searchResults && filtersApplied) {
      return searchResults.filter((patient) => {
        if (filters.gender !== 'any') {
          if (filters.gender === 'male' && patient.person.gender !== 'M') {
            return false;
          }
          if (filters.gender === 'female' && patient.person.gender !== 'F') {
            return false;
          }
          if (filters.gender === 'other' && patient.person.gender !== 'O') {
            return false;
          }
          if (filters.gender === 'unknown' && patient.person.gender !== 'U') {
            return false;
          }
        }

        if (filters.dateOfBirth) {
          const dayOfBirth = new Date(patient.person.birthdate).getDate();
          if (dayOfBirth !== filters.dateOfBirth) {
            return false;
          }
        }

        if (filters.monthOfBirth) {
          const monthOfBirth = new Date(patient.person.birthdate).getMonth() + 1;
          if (monthOfBirth !== filters.monthOfBirth) {
            return false;
          }
        }

        if (filters.yearOfBirth) {
          const yearOfBirth = new Date(patient.person.birthdate).getFullYear();
          if (yearOfBirth !== filters.yearOfBirth) {
            return false;
          }
        }

        if (filters.postcode) {
          if (!patient.person.addresses.some((address) => address.postalCode === filters.postcode)) {
            return false;
          }
        }

        if (filters.age) {
          if (patient.person.age !== filters.age) {
            return false;
          }
        }

        if (filters.phoneNumber) {
          if (
            !(
              patient.attributes.find((attr) => attr.attributeType.display === 'Telephone Number')?.value ===
              filters.phoneNumber.toString()
            )
          ) {
            return false;
          }
        }

        return true;
      });
    }

    return searchResults;
  }, [filtersApplied, filters, searchResults]);

  return (
    <div
      className={`${
        inTabletOrOverlay ? styles.advancedPatientSearchTabletOrOverlay : styles.advancedPatientSearchDesktop
      }`}>
      {!inTabletOrOverlay && (
        <div className={styles.refineSearchDesktop}>
          <RefineSearch filtersApplied={filtersApplied} setFilters={setFilters} inTabletOrOverlay={inTabletOrOverlay} />
        </div>
      )}
      <div
        className={`${
          inTabletOrOverlay ? styles.patientSearchResultsTabletOrOverlay : styles.patientSearchResultsDesktop
        }`}>
        <PatientSearchComponent
          query={query}
          stickyPagination={stickyPagination}
          selectPatientAction={selectPatientAction}
          inTabletOrOverlay={inTabletOrOverlay}
          hidePanel={hidePanel}
          isLoading={isLoading}
          fetchError={fetchError}
          searchResults={filteredResults ?? []}
        />
      </div>
      {inTabletOrOverlay && (
        <RefineSearch filtersApplied={filtersApplied} setFilters={setFilters} inTabletOrOverlay={inTabletOrOverlay} />
      )}
    </div>
  );
};

export default ClientRegistrySearchComponent;
