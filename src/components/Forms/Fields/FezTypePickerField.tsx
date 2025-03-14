import {PickerField} from './PickerField';
import React from 'react';
import {FezType} from '../../../libraries/Enums/FezType';

interface FezTypePickerFieldProps {
  name: string;
  label: string;
  value: FezType;
  choices?: FezType[];
}

const getTitle = (choice: FezType | undefined) => FezType.getLabel(choice);

export const FezTypePickerField = ({name, label, value, choices = FezType.lfgTypes}: FezTypePickerFieldProps) => {
  return (
    <PickerField<FezType | undefined> name={name} label={label} value={value} choices={choices} getTitle={getTitle} />
  );
};
