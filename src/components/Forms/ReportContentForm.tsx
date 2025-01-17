import React from 'react';
import {View} from 'react-native';
import {Formik, FormikHelpers} from 'formik';
import {useStyles} from '../Context/Contexts/StyleContext';
import {ReportData} from '../../libraries/Structs/ControllerStructs';
import {useAppTheme} from '../../styles/Theme';
import {Text} from 'react-native-paper';
import {TextField} from './Fields/TextField';
import {PrimaryActionButton} from '../Buttons/PrimaryActionButton';
import {ModalCard} from '../Cards/ModalCard';

interface ReportContentFormProps {
  onSubmit: (values: ReportData, formikBag: FormikHelpers<ReportData>) => void;
}

const initialValues: ReportData = {
  message: '',
};

const ReportContentFormBody = () => {
  const {commonStyles} = useStyles();
  return (
    <>
      <Text style={[commonStyles.marginBottomSmall]}>
        Use this form to report content or users to the Twitarr Moderation Team. We'll review it within 24 hours, and if
        deemed inappropriate the content will be removed and we may take actions against its author.
      </Text>
      <Text style={[commonStyles.marginBottomSmall]}>
        The content you are reporting is already attached. You can add additional information below.
      </Text>
      <TextField name={'message'} multiline={true} numberOfLines={3} />
    </>
  );
};

// https://formik.org/docs/guides/react-native
export const ReportContentForm = ({onSubmit}: ReportContentFormProps) => {
  const theme = useAppTheme();

  return (
    <Formik enableReinitialize={true} initialValues={initialValues} onSubmit={onSubmit}>
      {({handleSubmit, isSubmitting}) => (
        <View>
          <ModalCard
            title={'Report'}
            content={<ReportContentFormBody />}
            actions={
              <PrimaryActionButton
                buttonColor={theme.colors.twitarrNegativeButton}
                buttonText={'Send Report'}
                onPress={handleSubmit}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              />
            }
            closeButtonText={'Cancel'}
          />
        </View>
      )}
    </Formik>
  );
};
