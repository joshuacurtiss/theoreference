class Publication {
    constructor(symbol, name, regex, noch) {
        this.symbol=symbol;
        this.name=name;
        this.regex=regex;
        this.noch=noch||false;
        return this;
    }
    match(text) {
        return this.regex.test(text);
    }
}

module.exports=Publication;