import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import useSWRImmutable from 'swr/immutable';
import { openmrsFetch, useConfig, FetchResponse, openmrsObservableFetch, showToast } from '@openmrs/esm-framework';
import { PatientSearchResponse, SearchedPatient } from './types';
import { useTranslation } from 'react-i18next';
import { R4 } from '@ahryman40k/ts-fhir-types';

export function useClientRegistrySearch(
  searchTerm: string,
  searching: boolean = true
) {
  const config = useConfig();
  let url = `/ws/client-registry/R4/Patient?id=${searchTerm}`;
  
  
  const { data, isValidating, error } = useSWR<
    FetchResponse<{ results: R4.IBundle; links: Array<{ rel: 'prev' | 'next' }>; totalCount: number }>
  >(searching ? url : null, openmrsFetch);

  const results: {
    data: R4.IBundle;
    isLoading: boolean;
    fetchError: any;
    hasMore: boolean;
    loadingNewData: boolean;
    totalResults: number;
  } = useMemo(
    () => ({
      data: data?.data?.results,
      isLoading: !data?.data && !error,
      fetchError: error,
      hasMore: data?.data?.links?.some((link) => link.rel === 'next'),
      loadingNewData: isValidating,
      totalResults: data?.data?.totalCount,
    }),
    [data, isValidating, error],
  );

  return results;
}
