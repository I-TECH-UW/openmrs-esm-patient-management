import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@carbon/react";
import { Search } from "@carbon/react/icons";
import ClientRegistryOverlay from "../client-registry-overlay/client-registry-overlay.component";

interface ClientRegistrySearchButtonProps {
  buttonText?: string;
  overlayHeader?: string;
  selectPatientAction?: (patientUuid: string) => {};
  buttonProps?: Object;
}

const ClientRegistrySearchButton: React.FC<ClientRegistrySearchButtonProps> = ({
  buttonText,
  overlayHeader,
  selectPatientAction,
  buttonProps,
}) => {
  const { t } = useTranslation();
  const [showSearchOverlay, setShowSearchOverlay] = useState<boolean>(false);

  return (
    <>
      {showSearchOverlay && (
        <ClientRegistryOverlay
          onClose={() => setShowSearchOverlay(false)}
          header={overlayHeader}
          selectPatientAction={selectPatientAction}
        />
      )}

      <Button
        onClick={() => setShowSearchOverlay(true)}
        aria-label="Search Patient Button"
        aria-labelledby="Search Patient Button"
        renderIcon={(props) => <Search size={20} {...props} />}
        {...buttonProps}
      >
        {buttonText ? buttonText : t("searchPatient", "Search Patient")}
      </Button>
    </>
  );
};

export default ClientRegistrySearchButton;
