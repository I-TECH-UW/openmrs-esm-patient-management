import { R4 } from "@ahryman40k/ts-fhir-types";
import { FetchResponse, openmrsFetch, useConfig } from "@openmrs/esm-framework";
import { useMemo } from "react";
import useSWR from "swr";

export function useClientRegistrySearch(
  searchTerm: string,
  searching: boolean = true
) {
  const config = useConfig();
  let url = `/ws/client-registry/R4/Patient?id=${searchTerm}`;

  const { data, isValidating, error } = useSWR<
    FetchResponse<{
      results: R4.IBundle;
      links: Array<{ rel: "prev" | "next" }>;
      totalCount: number;
    }>
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
      hasMore: data?.data?.links?.some((link) => link.rel === "next"),
      loadingNewData: isValidating,
      totalResults: data?.data?.totalCount,
    }),
    [data, isValidating, error]
  );

  return results;
}
