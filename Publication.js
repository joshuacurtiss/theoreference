const moment=require("moment");

class Publication {
    constructor(symbol, name, regex, hasDates=false) {
        this.hasDates=hasDates;
        this.date=null
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
            if( this.isWatchtower() ) {
                out=this.date.format(Publication.DATE_FORMAT["w-"+(this.isOldWatchtower()?"old":"new")]);
            } else if( this.isAwake() ) {
                out=this.date.format(Publication.DATE_FORMAT["g-"+(this.isOldAwake()?"old":"new")]);
            } else if( Publication.DATE_FORMAT.hasOwnProperty(this.symbol) ) {
                out=this.date.format(Publication.DATE_FORMAT[this.symbol]);
            }
        }
        return out;
    }

    set symbol(symbol) {this._symbol=symbol.toLowerCase()}
    get symbol() {return this._symbol}

    isWatchtower() {return (["w","wp","ws"].indexOf(this.symbol)>=0)}
    isOldWatchtower() {return (this.isWatchtower() && this.date && this.date.year()<2016)}

    isAwake() {return (["g"].indexOf(this.symbol)>=0)}
    isOldAwake() {return (this.isAwake() && this.date && this.date.year()<2016)}

    match(text) {
        // When explicitly matching text to a publication, add ^ and $ to always match entire string.
        // This can avoid some bizarre false positives.
        var re=new RegExp("^"+this.regex.source+"$",this.regex.flags)
        return re.test(text);
    }

    toString() {return `${this.name} ${this.dateFormatted}`.trim()}
    toAbbrevString() {return `${this.symbol}${this.dateFormatted}`.trim()}

}

// TODO: Awake should be improved to handle the date variations (right now it only handles the first and last ones)
// - "g05 1/8" and "g05 1/22" for 2000-2005
// - "g 1/13" for monthly 2006-2015
// - "g17 No. 1" for special editions since 2016

Publication.DATE_FORMAT={
    "g-old":"YY M/D", 
    "g-new":"YY No. M",
    "w-old":"YY M/D",
    "w-new":"YY.MM",
    "yb":"YY",
    "km":" M/YY",
    "mwb":"YY MMM"
}

module.exports=Publication;