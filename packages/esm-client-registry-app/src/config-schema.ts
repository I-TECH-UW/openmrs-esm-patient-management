import { Type, validators } from '@openmrs/esm-framework';
export const configSchema = {
  
  contactAttributeType: {
    _type: Type.Array,
    _elements: {
      _type: Type.UUID,
    },
    _default: [
      // This UUID is for the Telephone Number
      '14d4f066-15f5-102d-96e4-000c29c2a5d7',
      // This UUID is for the email
      'e3d177ee-04ad-11ed-828d-0242ac1e0002',
    ],
  },
};
