import React, { ReactNode } from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface WhiteTextProps extends TextProps {
  children: ReactNode;
}

const WhiteText: React.FC<WhiteTextProps> = ({ children, style, ...props }) => {
  const combinedStyle = [styles.whiteText, style];

  return (
    <Text style={combinedStyle} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  whiteText: {
    color: 'white',
    // Add other common text styles here
  },
});

export default WhiteText;
