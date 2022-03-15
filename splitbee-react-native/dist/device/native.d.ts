export declare const getDeviceInfo: () => Promise<{
    os: {
        name: string;
        version: string | number;
    };
    client: {
        name: string;
        type: string;
        version: string;
        build: string;
    };
    device: {
        type: string;
        brand: string;
        model: string;
        deviceId: string;
    };
}>;
