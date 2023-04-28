export function getEnv(name: string): string {
    if (name in process.env) {
        return process.env[name];
    } else {
        throw new Error(`missing environment variable: ${name}`)
    }
}

export function getEnvString(name: string): string {
    return getEnv(name);
}

export function getEnvNumber(name: string, defaultOnError: boolean = false, defaultValue: number = 0): number {
    try {
        return parseInt(getEnv(name));
    } catch (e) {
        if (defaultOnError) {
            return defaultValue;
        } else {
            throw TypeError(e.message);
        }
    }
}

export function getEnvFloat(name: string, defaultOnError: boolean = false, defaultValue: number = 0): number {
    try {
        return parseFloat(getEnv(name));
    } catch (e) {
        if (defaultOnError) {
            return defaultValue;
        } else {
            throw TypeError(e.message);
        }
    }
}

export function getEnvBoolean(name: string, defaultOnError: boolean = false, defaultValue: boolean = false): boolean {
    const v = getEnv(name).trim().toLowerCase();
    if (v in ['true', 'false']) {
        return (v === 'true');
    } else {
        if (defaultOnError) {
            return defaultValue;
        } else {
            throw TypeError(`${name} expects boolean`);
        }
    }
}