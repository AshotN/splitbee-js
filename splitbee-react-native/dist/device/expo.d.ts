export declare const getDeviceInfo: () => Promise<{
    os: {
        name: string | null;
        version: string | null;
    };
    client: {
        name: string;
        type: string;
        version: string | null;
        build: string | null;
    };
    device: {
        type: string | undefined;
        brand: string | null;
        model: string | null;
        deviceId: any;
    };
}>;
