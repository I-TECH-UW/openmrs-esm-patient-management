import { R4 } from "@ahryman40k/ts-fhir-types";
import { Layer, Tile } from "@carbon/react";
import React from "react";
import { useTranslation } from "react-i18next";

import EmptyDataIllustration from "../ui-components/empty-data-illustration.component";
import styles from "./client-registry-lg.scss";
import PatientBanner, {
  PatientBannerSkeleton,
} from "./patient-banner/banner/patient-banner.component";

interface EmptyQueryIllustrationProps {
  inTabletOrOverlay: boolean;
}

export const EmptyQueryIllustration: React.FC<EmptyQueryIllustrationProps> = ({
  inTabletOrOverlay,
}) => {
  const { t } = useTranslation();
  return (
    <Layer>
      <Tile
        className={`${styles.emptySearchResultsTile} ${
          inTabletOrOverlay && styles.paddedEmptySearchResultsTile
        }`}
      >
        <EmptyDataIllustration />
        <p className={styles.emptyResultText}>
          {t(
            "noPatientChartsFoundMessage",
            "Sorry, no patient charts have been found"
          )}
        </p>
        <p className={styles.actionText}>
          <span>
            {t(
              "trySearchWithPatientUniqueID",
              "Try searching with the patient's unique ID number"
            )}
          </span>
          <br />
          <span>{t("orPatientName", "OR the patient's name(s)")}</span>
        </p>
      </Tile>
    </Layer>
  );
};

interface LoadingSearchResultsProps {}

export const LoadingSearchResults: React.FC<LoadingSearchResultsProps> = () => {
  return (
    <div className={styles.results}>
      <PatientBannerSkeleton />
      <PatientBannerSkeleton />
      <PatientBannerSkeleton />
      <PatientBannerSkeleton />
      <PatientBannerSkeleton />
    </div>
  );
};

interface FetchErrorIllustrationProps {
  inTabletOrOverlay: boolean;
}

export const FetchErrorIllustration: React.FC<FetchErrorIllustrationProps> = ({
  inTabletOrOverlay,
}) => {
  const { t } = useTranslation();
  return (
    <Layer>
      <Tile
        className={`${styles.emptySearchResultsTile} ${
          inTabletOrOverlay && styles.paddedEmptySearchResultsTile
        }`}
      >
        <EmptyDataIllustration />
        <div>
          <p className={styles.errorMessage}>{`${t("error", "Error")}`}</p>
          <p className={styles.errorCopy}>
            {t(
              "errorCopy",
              "Sorry, there was an error. You can try to reload this page, or contact the site administrator and quote the error code above."
            )}
          </p>
        </div>
      </Tile>
    </Layer>
  );
};

interface EmptySearchResultsIllustrationProps {
  inTabletOrOverlay: boolean;
}

export const EmptySearchResultsIllustration: React.FC<
  EmptySearchResultsIllustrationProps
> = ({ inTabletOrOverlay }) => {
  const { t } = useTranslation();
  return (
    <Layer>
      <Tile
        className={`${styles.emptySearchResultsTile} ${
          inTabletOrOverlay && styles.paddedEmptySearchResultsTile
        }`}
      >
        <EmptyDataIllustration />
        <p className={styles.emptyResultText}>
          {t(
            "noPatientChartsFoundMessage",
            "Sorry, no patient charts have been found"
          )}
        </p>
        <p className={styles.actionText}>
          <span>
            {t(
              "trySearchWithPatientUniqueID",
              "Try searching with the patient's unique ID number"
            )}
          </span>
          <br />
          <span>{t("orPatientName", "OR the patient's name(s)")}</span>
        </p>
      </Tile>
    </Layer>
  );
};

interface ClientRegistryResultsProps {
  searchResults: R4.IBundle_Entry[];
  handlePatientSelection: (evt: any, patientUuid: string) => void;
}

export const ClientRegistryResults: React.FC<ClientRegistryResultsProps> = ({
  searchResults,
  handlePatientSelection,
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.results}>
      {searchResults.map((patient: R4.IPatient, indx) => (
        <PatientBanner
          key={indx}
          selectPatientAction={handlePatientSelection}
          patientUuid={patient.id}
          patient={patient}
        />
      ))}
    </div>
  );
};
