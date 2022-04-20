import * as utils from '../utils';

export interface SessionDataProperties {
    id: string;
    value: string;
    uri: string;
    language: string;
}

export type SessionDataOptionalConstructorProperties = Partial<
    Pick<SessionDataProperties, 'value' | 'uri' | 'language'>
>;
export type SessionDataRequiredConstructorProperties = Pick<SessionDataProperties, 'id'>;
export type SessionDataConstructorProperties = SessionDataOptionalConstructorProperties &
    SessionDataRequiredConstructorProperties;

export class SessionData implements SessionDataProperties {
    public id: string;
    public value: string;
    public uri: string;
    public language: string;

    constructor({ id, value, uri, language }: SessionDataConstructorProperties) {
        utils.PARAMCHECK(id, value || uri);
        utils.ASSERT('SessionData cannot have both value and uri, shoud be either.', !(value && uri));
        this.id = id;
        this.value = value;
        this.uri = uri;
        this.language = language;
    }
}

export default SessionData;
