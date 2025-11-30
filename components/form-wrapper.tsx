import type { FormEvent, ReactNode } from 'react';
import React from 'react';
import { Platform, StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

type FormWrapperProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onSubmit?: () => void | Promise<void>;
};

export function FormWrapper({ children, style, onSubmit }: FormWrapperProps) {
  const flattenedStyle = StyleSheet.flatten(style);

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (onSubmit) {
      void onSubmit();
    }
  };

  if (Platform.OS === 'web') {
    return (
      <form
        style={(flattenedStyle as React.CSSProperties) ?? undefined}
        onSubmit={handleSubmit}
        noValidate
      >
        {children}
        <button type="submit" style={{ display: 'none' }} />
      </form>
    );
  }

  return <View style={style}>{children}</View>;
}
