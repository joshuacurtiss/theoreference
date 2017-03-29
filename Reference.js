const REGEX=require("./RegEx");

class Reference {
    constructor(publication,chapter,pars) {
        this.availableCues=[];
        this.publication=publication;
        this.chapter=chapter;
        this.pars=pars;
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
                var sanitized=[];
                p.trim().split("-").splice(0,2).forEach(thisp=>sanitized.push(this.sanitizePar(thisp)));
                this._pars.push(sanitized.join("-"));
            }
        }
        this.cues=this.createCuesFromPars(this._pars)
    }
    get cuesByName() {return this.cues.map(id=>this.availableCues[id])}
    get cues() {return this._cues}
    set cues(cues) {this._cues=cues}
    get availableCues() {return this._availableCues}
    set availableCues(cues) {
        // Can receive an array of strings for cue names. But it also will receive an array of cues as the
        // webvtt library would return, where each array item is an object and the name is in a "content" property. 
        var sanitizedCues=[];
        if( Array.isArray(cues) && cues.length ) {
            for( var c of cues ) {
                if( typeof c=="object" && c.hasOwnProperty("content") ) sanitizedCues.push(c.content);
                else if( typeof c=="string" ) sanitizedCues.push(c);
            }
        }
        this._availableCues=sanitizedCues;
        if(sanitizedCues.length) this.pars=this.pars; // Trigger a reparsing now that we have the cues.
    }
    createCuesFromPars(pars) {
        var cues=[];
        // Only work if you have the list of available cues.
        if( this.hasAvailableCues() ) {
            // Loop thru all pars
            for( var par of pars ) {
                // Get start/end values, if range. If not range, they'll be identical.
                var split=par.split("-");
                var start=split[0].trim();
                var end=split[split.length-1].trim();
                // Add the "P" for numeric values (but include "14a" type values)
                var cuenumRE=new RegExp("^"+REGEX.CUENUMBER_REGEX.source,REGEX.CUENUMBER_REGEX.flags);
                if( cuenumRE.test(start) ) start="P "+start;
                if( cuenumRE.test(end) ) end="P "+end;
                // Find matches in the available cues
                var startRE=new RegExp("^"+start+"[a-f]?$","i");
                var endRE=new RegExp("^"+end+"[a-f]?$","i");
                var startI=this.availableCues.findIndex((item,index)=>{
                    if(startRE.test(item)) return index;
                });
                // For ending, grab the last matching item. So make array of matches and grab last item.
                var endArray=this.availableCues.filter((item,index)=>{
                    if(endRE.test(item)) return index;
                });
                var endI=this.availableCues.indexOf(endArray[endArray.length-1]);
                // Now check if any other materials after the par should be included, like scriptures, etc.
                var index=endI;
                while( index>=0 ) {
                    if( index+1<this.availableCues.length && !REGEX.PARBOUNDARY_REGEX.test(this.availableCues[index+1])) endI=++index;
                    else index=-1;
                }
                // Push out the range of matching cues, given that they were found
                if( startI>=0 && endI>=0 ) {
                    for( var i=startI ; i<=endI ; i++ ) cues.push(i);
                }
            }
            // If pars was empty, that means we want everything. Just copy from available cues.
            if( pars.length==0 ) {
                for( var i=0 ; i<this.availableCues.length ; i++ )
                    cues.push(i);
            }
        }
        return cues;
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
        // Trim and Capitalize
        txt=txt.trim();
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
    hasAvailableCues() {
        return (this.availableCues.length>0);
    }
    isAllPars() {
        return  (this.hasAvailableCues()==false && this.pars.length==0) ||
                (this.hasAvailableCues() && this.cues.length==this.availableCues.length);
    }
    toString() {
        return `${this.publication.symbol} ${this.chapter}${this.isAllPars()?"":":"}${this.parsToString()}`;
    }
    toAbbrevString() {
        return `${this.publication.symbol}${this.chapter}${this.isAllPars()?"":":"}${this.parsToString()}`.replace(/\s/g,"");
    }
}

module.exports=Reference;