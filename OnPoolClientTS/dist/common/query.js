"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Query = (function () {
    function Query() {
        this.PoolAllCount = -1;
    }
    Query.prototype.AddJson = function (obj) {
        this.Json = JSON.stringify(obj);
        return this;
    };
    Query.prototype.GetBytes = function () {
        var sb = "";
        if (this.To)
            sb += (this.To);
        sb += ("|");
        if (this.From)
            sb += (this.From);
        sb += ("|");
        if (this.RequestKey)
            sb += (this.RequestKey);
        sb += ("|");
        sb += (this.Method);
        sb += ("|");
        if (this.Json) {
            sb += this.Json.replace(/\|/g, '%`%');
        }
        sb += ("|");
        if (this.PoolAllCount > -1) {
            sb += this.PoolAllCount;
        }
        var bytes = new Uint8Array(sb.length + 3 + 1);
        bytes[0] = this.Direction;
        bytes[1] = this.Type;
        bytes[2] = this.ResponseOptions;
        var b = sb.split('').map(function (x) { return x.charCodeAt(0); });
        for (var i = 0; i < b.length; i++) {
            bytes[i + 3] = b[i];
        }
        if (bytes.length > 1024 * 1024 * 5) {
            throw "The message is longer than 5mb.";
        }
        return bytes;
    };
    Query.Parse = function (continueBuffer) {
        try {
            var query = new Query();
            query.Direction = continueBuffer[0];
            query.Type = continueBuffer[1];
            query.ResponseOptions = continueBuffer[2];
            var pieces = new Buffer(continueBuffer.slice(3)).toString("utf8").split('|');
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
        }
        catch (ex) {
            console.log("Failed Receive message:");
            console.log("" + new Buffer(continueBuffer).toString("utf8"));
            console.log("" + ex);
            return null;
        }
    };
    Query.BuildServerRequest = function (method, options) {
        if (options === void 0) { options = ResponseOptions.SingleResponse; }
        var q = new Query();
        q.Method = method;
        q.Direction = QueryDirection.Request;
        q.Type = QueryType.Server;
        q.ResponseOptions = options;
        return q;
    };
    Query.prototype.ToString = function () {
        var sb = "";
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
    };
    Query.prototype.GetJson = function () {
        if (this.Json)
            return JSON.parse(this.Json);
        return null;
    };
    return Query;
}());
exports.Query = Query;
var ResponseOptions;
(function (ResponseOptions) {
    ResponseOptions[ResponseOptions["SingleResponse"] = 1] = "SingleResponse";
    ResponseOptions[ResponseOptions["OpenResponse"] = 2] = "OpenResponse";
})(ResponseOptions = exports.ResponseOptions || (exports.ResponseOptions = {}));
var QueryDirection;
(function (QueryDirection) {
    QueryDirection[QueryDirection["Request"] = 1] = "Request";
    QueryDirection[QueryDirection["Response"] = 2] = "Response";
})(QueryDirection = exports.QueryDirection || (exports.QueryDirection = {}));
var QueryType;
(function (QueryType) {
    QueryType[QueryType["Client"] = 1] = "Client";
    QueryType[QueryType["Pool"] = 2] = "Pool";
    QueryType[QueryType["PoolAll"] = 3] = "PoolAll";
    QueryType[QueryType["Server"] = 4] = "Server";
})(QueryType = exports.QueryType || (exports.QueryType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbW9uL3F1ZXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7SUFXSTtRQUZPLGlCQUFZLEdBQVMsQ0FBQyxDQUFDLENBQUM7SUFHL0IsQ0FBQztJQUdNLHVCQUFPLEdBQWQsVUFBa0IsR0FBTTtRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sd0JBQVEsR0FBZjtRQUNJLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNaLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0IsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1osRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3QyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwQixFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1osRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBQyxLQUFLLENBQUMsQ0FBQztR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