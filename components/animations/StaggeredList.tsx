/**
 * Staggered List Animation Component
 * Animates list items with staggered delays
 */

import React from 'react';
import { ViewStyle } from 'react-native';
import { FadeIn } from './FadeIn';
import { SlideIn } from './SlideIn';

interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  animationType?: 'fade' | 'slide';
  slideDirection?: 'up' | 'down' | 'left' | 'right';
  style?: ViewStyle;
}

export function StaggeredList({
  children,
  staggerDelay = 50,
  animationType = 'slide',
  slideDirection = 'up',
  style,
}: StaggeredListProps) {
  return (
    <>
      {React.Children.map(children, (child, index) => {
        const delay = index * staggerDelay;

        if (animationType === 'fade') {
          return (
            <FadeIn key={index} delay={delay} style={style}>
              {child}
            </FadeIn>
          );
        }

        return (
          <SlideIn key={index} direction={slideDirection} delay={delay} style={style}>
            {child}
          </SlideIn>
        );
      })}
    </>
  );
}
