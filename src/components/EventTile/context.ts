import { createContext, useContext } from 'react';
import { EventTileContextType } from './types';

const EventTileContext = createContext<EventTileContextType>({ event: undefined });
const useEventTileContext = () => {
  const context = useContext(EventTileContext);

  if (!context) {
    throw new Error('useEventTileContext must be used within an EventTile');
  }

  return context;
};

export { EventTileContext, useEventTileContext };
