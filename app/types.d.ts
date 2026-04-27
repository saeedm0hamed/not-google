import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      marquee: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        scrollamount?: string;
        scrolldelay?: string;
        direction?: 'left' | 'right' | 'up' | 'down';
        behavior?: 'scroll' | 'slide' | 'alternate';
        loop?: string;
      }, HTMLElement>;
    }
  }
}
