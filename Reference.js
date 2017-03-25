const REGEX=require("./RegEx");

class Reference {
    constructor(publication,chapter,pars) {
        this.publication=publication;
        this.chapter=chapter;
        this.pars=pars;
        this.cues=[];
        return this;
    }
    get publication() {return this._publication}
    set publication(publication) {if(publication) this._publication=publication}
    get chapter() {return this._chapter}
    set chapter(chapter) {if(chapter) this._chapter=parseInt(this.sanitizeChapter(chapter))}
    get pars() {return this._pars}
    set pars(pars) {
        this._pars=[];
        if( pars && Array.isArray(pars) ) this._pars=pars;
        else if( pars && typeof pars=="number" ) this._pars.push(pars);
        else if( pars && typeof pars=="string" ) {
            for( var p of pars.split(",") ) {
                p=p.trim();
                // TODO: Handle hyphen for ranges, if has cues. 
                if( p.split("-").length==2 ) {
                    var start=this.sanitizePar(p.split("-")[0]);
                    var end=this.sanitizePar(p.split("-")[1]);
                    p=start+"-"+end;
                    this._pars.push(p);
                } else {
                    this._pars.push(this.sanitizePar(p));
                }
            }
        }
    }
    get cues() {return this._cues}
    set cues(cues) {
        // Can receive an array of strings for cue names. But it also will receive an array of cues as the
        // webvtt library would return, where each array item is an object and the name is in a "content" property. 
        var sanitizedCues=[];
        if( Array.isArray(cues) && cues.length ) {
            for( var c of cues ) {
                if( typeof c=="object" && c.hasOwnProperty("content") ) sanitizedCues.push(c.content);
                else if( typeof c=="string" ) sanitizedCues.push(c);
            }
        }
        this._cues=sanitizedCues;
        if(sanitizedCues.length) this.pars=this.pars; // Trigger a reparsing now that we have the cues.
    }
    sanitizeChapter(txt) {
        return txt.replace(/^(?:ch|chapter)?\s*(\d+)$/i,"$1");
    }
    sanitizePar(txt) {
        var parRE=new RegExp("^(?:par|p)?\\s*(CUENUMBER)$"
                    .replace("CUENUMBER",REGEX.CUENUMBER_REGEX.source),"i");
        var questionRE=new RegExp("^(?:question|q)\\s*(CUENUMBER)$"
                    .replace("CUENUMBER",REGEX.CUENUMBER_REGEX.source),"i");
        var cueRE=new RegExp("^(CUESWITHNUMBERS)\\s*(CUENUMBER)?$"
                    .replace("CUESWITHNUMBERS",REGEX.CUESWITHNUMBERS_REGEX.source)
                    .replace("CUENUMBER",REGEX.CUENUMBER_REGEX.source),"i");
        if( parRE.test(txt) ) {
            txt=txt.replace(parRE,"$1");
        } else if( questionRE.test(txt) ) {
            txt=txt.replace(questionRE,"Q $1");
        } else if( cueRE.test(txt) ) {
            var match=cueRE.exec(txt);
            txt=match[1]+(match[2]?` ${match[2]}`:``);
        }
        // Capitalize
        txt=txt[0].toUpperCase() + txt.slice(1);
        return txt;
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
    hasCues() {
        return (this.cues.length>0);
    }
    isAllPars() {
        return  (this.hasCues()==false && this.pars.length==0) ||
                (this.hasCues() && this.pars.length==this.cues.length);
    }
    toString() {
        return `${this.publication.symbol} ${this.chapter}${this.isAllPars()?"":":"}${this.parsToString()}`;
    }
    toAbbrevString() {
        return `${this.publication.symbol}${this.chapter}${this.isAllPars()?"":":"}${this.parsToString()}`.replace(/\s/g,"");
    }
}

module.exports=Reference;