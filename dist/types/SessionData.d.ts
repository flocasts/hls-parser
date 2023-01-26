export interface SessionDataProperties {
    id: string;
    value: string;
    uri: string;
    language: string;
}
export declare type SessionDataOptionalConstructorProperties = Partial<Pick<SessionDataProperties, 'value' | 'uri' | 'language'>>;
export declare type SessionDataRequiredConstructorProperties = Pick<SessionDataProperties, 'id'>;
export declare type SessionDataConstructorProperties = SessionDataOptionalConstructorProperties & SessionDataRequiredConstructorProperties;
export declare class SessionData implements SessionDataProperties {
    id: string;
    value: string;
    uri: string;
    language: string;
    constructor({ id, value, uri, language }: SessionDataConstructorProperties);
}
export default SessionData;
