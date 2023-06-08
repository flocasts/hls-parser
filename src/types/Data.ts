import * as utils from '../utils';

export class Data {
    public type: string;

    constructor(type: string) {
        utils.PARAMCHECK(type);
        this.type = type;
    }
}

export default Data;
