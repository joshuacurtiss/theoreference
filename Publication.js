const moment=require("moment");

class Publication {
    constructor(symbol, name, regex, hasDates=false) {
        this.hasDates=hasDates;
        this.date="";
        this.symbol=symbol;
        this.name=name;
        this.regex=regex;
        return this;
    }

    set date(date) {
        var m=moment(date);
        this._date=m.isValid()?m:null;
    }
    get date() {return this._date}
    get dateFormatted() {
        var out="";
        if( this.hasDates && this.date ) {
            if( ["w","wp","ws"].indexOf(this.symbol)>=0 ) {
                out=this.date.format(Publication.DATE_FORMAT["w-"+(this.date.year()<2016?"old":"new")]);
            } else if( Publication.DATE_FORMAT.hasOwnProperty(this.symbol) ) {
                out=this.date.format(Publication.DATE_FORMAT[this.symbol]);
            }
        }
        return out;
    }

    set symbol(symbol) {this._symbol=symbol.toLowerCase()}
    get symbol() {return this._symbol}

    match(text) {
        // When explicitly matching text to a publication, add ^ and $ to always match entire string.
        // This can avoid some bizarre false positives.
        var re=new RegExp("^"+this.regex.source+"$",this.regex.flags)
        return re.test(text);
    }

    toString() {return `${this.name} ${this.dateFormatted}`.trim()}
    toAbbrevString() {return `${this.symbol}${this.dateFormatted}`.trim()}

}

Publication.DATE_FORMAT={
    "w-old":"YY M/D",
    "w-new":"YY.MM",
    "yb":"YY",
    "km":" M/YY",
    "mwb":"YY MMM"
}

module.exports=Publication;