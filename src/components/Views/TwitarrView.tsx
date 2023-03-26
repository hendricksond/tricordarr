import {WebView} from 'react-native-webview';
import React, {useEffect, useState, useRef} from 'react';
import {AppSettings} from '../../libraries/AppSettings';
import {ActivityIndicator} from 'react-native';
import {useBackHandler} from '@react-native-community/hooks';

interface TwitarrViewProps {
  route: any;
}

export const TwitarrView = ({route}: TwitarrViewProps) => {
  const [url, setUrl] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState();
  const [handleGoBack, setHandleGoBack] = useState(false);
  const webViewRef = useRef();

  const handleBackButtonPress = () => {
    try {
      webViewRef.current?.goBack();
      return true;
    } catch (err) {
      console.log('[handleBackButtonPress] Error : ', err.message);
      return false;
    }
  };

  const handleWebViewNavigationStateChange = newNavState => {
    const {canGoBack} = newNavState;
    setHandleGoBack(canGoBack);
  };

  useBackHandler(() => {
    if (handleGoBack) {
      return handleBackButtonPress();
    }
    // let the default thing happen
    return false;
  });

  useEffect(() => {
    const loadSettings = async () => {
      let newUrl = await AppSettings.SERVER_URL.getValue();

      if (route?.params?.resource) {
        newUrl += `/${route.params.resource}`;

        if (route.params.id) {
          newUrl += `/${route.params.id}`;
        }
      }

      setUrl(newUrl);
      setIsLoading(false);
    };

    if (route?.params?.timestamp != key) {
      setKey(route?.params?.timestamp);
      setHandleGoBack(false);
    }

    loadSettings();
  }, [route?.params?.timestamp, route?.params?.resource, route?.params?.id, isLoading]);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <WebView
      source={{uri: url}}
      key={key}
      ref={webViewRef}
      onNavigationStateChange={handleWebViewNavigationStateChange}
    />
  );
};