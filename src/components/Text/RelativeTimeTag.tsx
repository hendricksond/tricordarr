import React, {PropsWithChildren} from 'react';
import {StyleProp, TextStyle} from 'react-native';
import {Text} from 'react-native-paper';
import ReactTimeAgo from 'react-time-ago';
import {MD3TypescaleKey} from 'react-native-paper/lib/typescript/types';

interface RelativeTimeTagProps {
  date?: Date;
  style?: StyleProp<TextStyle>;
  variant?: keyof typeof MD3TypescaleKey;
  raw?: boolean;
}

/**
 * This follows the RelativeTimeTag from Swiftarr.
 * https://github.com/jocosocial/swiftarr/blob/master/Sources/App/Site/Utilities/CustomLeafTags.swift.
 *
 * Relies on:
 * https://catamphetamine.gitlab.io/react-time-ago/
 * https://gitlab.com/catamphetamine/react-time-ago
 */
export const RelativeTimeTag = ({date, style, variant, raw}: RelativeTimeTagProps) => {
  if (!date) {
    return <></>;
  }

  // ReactTimeAgo doesn't support dynamic styling of the component, and it's own
  // style parameter is not what you think it is.
  const StylizedText = ({children}: PropsWithChildren) => {
    return (
      <Text variant={variant} style={style}>
        {children}
      </Text>
    );
  };

  if (raw) {
    return <StylizedText>{date?.toString()}</StylizedText>;
  }

  // The Date.parse(date.toString()) is dumb but necessary.
  // https://github.com/catamphetamine/react-time-ago/issues/18
  return <ReactTimeAgo date={Date.parse(date.toString())} locale="en-US" component={StylizedText} />;
};
