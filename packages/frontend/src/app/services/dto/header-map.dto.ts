import { HeaderMappingInputInterface } from "@arthropodindex/common";

export class HeaderMap implements HeaderMappingInputInterface {
    collectionCode = "";
    collectionName = "";
    country = "";
    gbifDate = "";
    gbifExists = "";
    inIdigbio = "";
    institutionCode = "";
    institutionName = "";
    latitude = "";
    longitude = "";
    scanExists = "";
    scanType = "";
    size = "";
    state = "";
    tier = "";
    url = "";

    set(key: string, value: string): void {
        Reflect.set(this, key, value);
    }

    get(key: string): string {
        return Reflect.get(this, key);
    }

    keys(): string[] {
        return Reflect.ownKeys(this) as string[];
    }

    has(key: string): boolean {
        return this.keys().includes(key);
    }
}
