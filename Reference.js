class Reference {
    constructor(publication,chapter,pars) {
        this.publication=publication;
        this.chapter=chapter;
        this.pars=pars;
        return this;
    }
    get publication() {return this._publication}
    set publication(publication) {if(publication) this._publication=publication}
    get chapter() {return this._chapter}
    set chapter(chapter) {if(chapter) this._chapter=parseInt(chapter)}
    get pars() {return this._pars}
    set pars(pars) {
        this._pars=[];
        if( pars && Array.isArray(pars) ) this._pars=pars;
        else if( pars && typeof pars=="number" ) this._pars.push(pars);
        else if( pars && typeof pars=="string" ) {
            // TODO: Enhace to support references to ART or Q or embedded scriptures
            for( var p of pars.split(",") ) {
                p=p.trim();
                // TODO: Handle hyphen for ranges, if numbers. 
                // TODO: Store as ints for paragraphs, remove the "P" if they put it in.
                // if( p.split("-").length==2 ) {
                //     var start=p.split("-")[0];
                //     var end=p.split("-")[1];
                //     if( start<=end ) {
                //         for( var i=start ; i<=end ; i++ ) this._pars.push(parseInt(i));
                //     }
                // }
                // else 
                this._pars.push(p);
            }
        }
    }
    parsToString() {
        var i=0;
        var len=this.pars.length;
        var csv=[];
        var thisp, nextp, seqstart, insequence=false;
        do {
            thisp=this.pars[i];
            nextp=this.pars[i+1] || 0;
            if( ! insequence && thisp+1==nextp ) {
                seqstart=thisp;
                insequence=true;
            } else if( ! insequence ) {
                csv.push(thisp);
            } else if( thisp+1 != nextp ) {
                csv.push(`${seqstart}-${thisp}`);
                insequence=false;
            }
        }
        while( ++i<len );
        return csv.join(", ");
    }
    valid() {
        return this.publication && this.chapter;
    }
    isAllPars() {
        return (this.pars.length==0);
    }
    toString() {
        return `${this.publication.symbol} ${this.chapter}${this.isAllPars()?"":":"}${this.parsToString()}`;
    }
    toAbbrevString() {
        return `${this.publication.symbol}${this.chapter}${this.isAllPars()?"":":"}${this.parsToString()}`.replace(/\s/g,"");
    }
}

module.exports=Reference;