﻿export class Query {
    public To: string;
    public From: string;
    public Type: QueryType;
    public Direction: QueryDirection;
    public ResponseOptions: ResponseOptions;
    public Method: string;
    public RequestKey: string;
    public Json: string;
    public PoolAllCount: number=-1;

    constructor() {
    }


    public AddJson<T>(obj: T): Query {
        this.Json = JSON.stringify(obj);
        return this;
    }

    public GetBytes(): Uint8Array {
        let sb = "";
        if (this.To) sb += (this.To);
        sb += ("|");
        if (this.From) sb += (this.From);
        sb += ("|");
        if (this.RequestKey) sb += (this.RequestKey);
        sb += ("|");
        sb += (this.Method);
        sb += ("|");
        if (this.Json) {
            sb += this.Json.replace(/\|/g,'%`%');
        }
        sb += ("|");
        if (this.PoolAllCount > -1) {
            sb += this.PoolAllCount;
        }
        const bytes = new Uint8Array(sb.length + 3 + 1);
        bytes[0] = <number>this.Direction;
        bytes[1] = <number>this.Type;
        bytes[2] = <number>this.ResponseOptions;

        const b = sb.split('').map((x) => x.charCodeAt(0));

        for (let i = 0; i < b.length; i++) {
            bytes[i + 3] = b[i];
        }

        if (bytes.length > 1024 * 1024 * 5) {
            throw "The message is longer than 5mb.";
        }

        return bytes;
    }

    public static Parse(continueBuffer: Uint8Array): Query {
        try {
            const query = new Query();

            query.Direction = <QueryDirection>continueBuffer[0];
            query.Type = <QueryType>continueBuffer[1];
            query.ResponseOptions = <ResponseOptions>continueBuffer[2];
            const pieces = new Buffer(continueBuffer.slice(3)).toString("utf8").split('|');


            if (pieces[0])
                query.To = pieces[0];
            if (pieces[1])
                query.From = pieces[1];
            if (pieces[2])
                query.RequestKey = pieces[2];
            query.Method = pieces[3];
            if (pieces[4]) {
                query.Json = pieces[4].replace(/%`%/g, '|');
            }
            if (pieces[5]) {
                query.PoolAllCount = parseInt(pieces[5]);
            }

            return query;
        } catch (ex) {
            console.log("Failed Receive message:");
            console.log(`${new Buffer(continueBuffer).toString("utf8")}`);
            console.log(`${ex}`);
            return null;
        }

    }

    public static BuildServerRequest(method: string, options: ResponseOptions = ResponseOptions.SingleResponse): Query {
        let q = new Query();
        q.Method = method;
        q.Direction = QueryDirection.Request;
        q.Type = QueryType.Server;
        q.ResponseOptions = options;
        return q;
    }

    public ToString(): string {
        let sb = "";
        sb += (this.Method);
        sb += ("?");
        sb += "Json=" + encodeURIComponent(this.Json) + "&";
        sb += "PoolAllCount=" + this.PoolAllCount;
        sb += (this.Direction);
        sb += ("/");
        sb += (this.Type);
        sb += ("|");
        sb += (this.To);
        sb += ("|");
        sb += (this.From);
        sb += ("|");
        sb += (this.RequestKey);
        sb += ("|");
        sb += (this.ResponseOptions);
        return sb;
    }

    public GetJson<T>(): T {
        if (this.Json)
            return <T>JSON.parse(this.Json);
        return null;
    }
}

export enum ResponseOptions {
    SingleResponse = 1,
    OpenResponse = 2
}

export enum QueryDirection {
    Request = 1,
    Response = 2
}

export enum QueryType {
    Client = 1,
    Pool = 2,
    PoolAll = 3,
    Server = 4
}