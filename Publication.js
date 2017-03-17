class Publication {
    constructor(symbol, name, regex) {
        this.symbol=symbol;
        this.name=name;
        this.regex=regex;
        return this;
    }
    match(text) {
        // When explicitly matching text to a publication, add ^ and $ to always match entire string.
        // This can avoid some bizarre false positives.
        var re=new RegExp("^"+this.regex.source+"$",this.regex.flags)
        return re.test(text);
    }
}

module.exports=Publication;