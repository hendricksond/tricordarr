import {SafeAreaView, ScrollView, View} from 'react-native';
import React from 'react';
import {useTheme, List, Divider} from 'react-native-paper';

export const SettingsView = ({navigation}) => {
  const theme = useTheme();
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{backgroundColor: theme.colors.background}}>
          <List.Section>
            <List.Subheader>Network</List.Subheader>
            <List.Item title={'Server URL'} description={'URL of the Twitarr server.'}
                       onPress={() => navigation.push('SettingDetail', {settingKey: 'SERVER_URL'})}/>
          </List.Section>
          <Divider bold={true}/>
          <List.Section>
            <List.Subheader>Account</List.Subheader>
            <List.Item title={'Username'}/>
          </List.Section>
          <Divider bold={true}/>
          <List.Section>
            <List.Subheader>Preferences</List.Subheader>
            <List.Item title={'SoonTM'}/>
          </List.Section>
          <Divider bold={true}/>
          <List.Section>
            <List.Subheader>About</List.Subheader>
            <List.Item title={'App Information'}/>
          </List.Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};