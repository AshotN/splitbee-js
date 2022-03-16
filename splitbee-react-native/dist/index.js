import { useRef } from 'react';
import { AppState } from 'react-native';
import { analytics } from '@splitbee/core';
import { getActiveSeconds, resetTime } from './timer';
import { getDeviceInfo } from './device';
import { isDevice } from 'expo-device';
const AsyncStorage = (() => {
    if (isDevice)
        return require('@react-native-async-storage/async-storage').default;
    return null;
})();
const UID_KEY = 'splitbee_uid';
const USERID_KEY = 'splitbee_userId';
let projectToken;
let uid;
let userId;
let requestId;
let lastPage;
const generateUid = () => Math.random().toString(36).substring(7);
const loadUid = async () => {
    uid = uid || (await AsyncStorage?.getItem('splitbee_uid')) || undefined;
    userId =
        userId || (await AsyncStorage?.getItem('splitbee_userId')) || undefined;
};
export const useTrackReactNavigation = (ref) => {
    const navigationRef = useRef(null);
    const routeNameRef = useRef(null);
    const navRef = ref?.current || navigationRef.current;
    return [
        {
            onReady: () => (routeNameRef.current = navRef?.getCurrentRoute().name),
            onStateChange: async () => {
                const previousRouteName = routeNameRef.current;
                const currentRouteName = navRef?.getCurrentRoute()?.name;
                if (previousRouteName !== currentRouteName) {
                    splitbee.screen(currentRouteName);
                }
                routeNameRef.current = currentRouteName;
            },
        },
        ref || navigationRef,
    ];
};
const sendEnd = async (closeApp) => {
    if (requestId) {
        await analytics.end({
            requestId,
            data: {
                duration: getActiveSeconds(),
                ...(closeApp && { destination: 'close' }),
            },
            context: { projectId: projectToken, uid, userId },
        });
    }
    resetTime();
};
const onChange = async (state) => {
    if (state === 'background' && requestId) {
        await sendEnd(true);
    }
    else if (state === 'active') {
        if (lastPage) {
            splitbee.screen(lastPage);
        }
    }
};
const processResponse = async (response) => {
    if (response?.uid) {
        uid = response.uid;
        await AsyncStorage?.setItem(UID_KEY, response.uid);
    }
};
const getContext = async () => ({
    projectId: projectToken,
    uid,
    userId,
    device: await getDeviceInfo(),
});
const splitbee = {
    init: (token) => {
        if (!isDevice)
            return false;
        projectToken = token;
        loadUid();
        AppState.removeEventListener('change', onChange);
        AppState.addEventListener('change', onChange);
        return true;
    },
    setUserId: (id) => {
        userId = id;
        AsyncStorage?.setItem(USERID_KEY, id)
            .then(() => { })
            .catch(() => { });
    },
    screen: async (page) => {
        sendEnd();
        requestId = generateUid();
        if (projectToken) {
            lastPage = page;
            const response = await analytics.page({
                page,
                data: {
                    requestId,
                },
                context: await getContext(),
            });
            processResponse(response);
        }
    },
    track: async (event, data) => {
        if (projectToken) {
            const response = await analytics.track({
                event,
                data,
                context: await getContext(),
            });
            processResponse(response);
        }
    },
    identify: async (userData) => {
        if (projectToken) {
            const response = await analytics.identify({
                userData,
                context: await getContext(),
            });
            processResponse(response);
        }
    },
};
export default splitbee;
