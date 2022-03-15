/// <reference types="react" />
import { JSONType } from '@splitbee/core';
import { NavigationContainerRef } from '@react-navigation/native';
export declare const useTrackReactNavigation: (ref?: import("react").MutableRefObject<NavigationContainerRef> | undefined) => [{
    onReady: () => void;
    onStateChange: () => void;
}, React.MutableRefObject<NavigationContainerRef | null>];
declare const splitbee: {
    init: (token: string) => void;
    setUserId: (id: string) => void;
    screen: (page: string) => Promise<void>;
    track: (event: string, data?: any) => Promise<void>;
    identify: (userData: JSONType) => Promise<void>;
};
export default splitbee;
