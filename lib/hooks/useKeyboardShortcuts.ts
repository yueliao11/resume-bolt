'use client';

import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(({ key, ctrlKey, metaKey, shiftKey, altKey, callback }) => {
        const isMatch = 
          event.key.toLowerCase() === key.toLowerCase() &&
          !!event.ctrlKey === !!ctrlKey &&
          !!event.metaKey === !!metaKey &&
          !!event.shiftKey === !!shiftKey &&
          !!event.altKey === !!altKey;

        if (isMatch) {
          event.preventDefault();
          callback();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}