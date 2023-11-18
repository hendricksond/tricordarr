import {FezType} from '../Enums/FezType';

export interface SettingFormValues {
  settingValue: string;
}

export interface LoginFormValues {
  username: string;
  password: string;
}

export interface UserRegistrationFormValues {
  username: string;
  password: string;
  passwordVerify: string;
  verification: string;
}

export interface KeywordFormValues {
  keyword: string;
}

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  newPasswordVerify: string;
}

export interface ChangeUsernameFormValues {
  username: string;
}

export interface FezFormValues {
  title: string;
  location: string;
  fezType: FezType;
  startDate: string;
  duration: string;
  minCapacity: string;
  maxCapacity: string;
  info: string;
  startTime: {
    hours: number;
    minutes: number;
  };
}
