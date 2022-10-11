import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { Query } from '@carbon/react/icons';
import PatientSearchOverlay from '../patient-search-overlay/patient-search-overlay.component';

interface PatientSearchButtonProps {L
  buttonText?: string;
  overlayHeader?: string;
  selectPatientAction?: (patientUuid: string) => {};
  buttonProps?: Object;
}

const PatientSearchButton: React.FC<PatientSearchButtonProps> = ({
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
        <PatientSearchOverlay
          onClose={() => setShowSearchOverlay(false)}
          header={overlayHeader}
          selectPatientAction={selectPatientAction}
        />
      )}

      <Button
        onClick={() => setShowSearchOverlay(true)}
        aria-label="Search Patient Button"
        aria-labelledby="Search Patient Button"
        renderIcon={(props) => <Query size={20} {...props} />}
        {...buttonProps}>
        {buttonText ? buttonText : t('searchPatient', 'Search Patient')}
      </Button>
    </>
  );
};

export default PatientSearchButton;
