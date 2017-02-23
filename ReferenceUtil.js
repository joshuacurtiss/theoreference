let Publication=require("./Publication");
let Reference=require("./Reference");

class ReferenceUtil {

    constructor() {
        return this;
    }

    /*  
     *  parseReferences:  Receives text and parses it into an array of Reference objects.
     *  It outputs an array even if only one reference is matched. 
     * 
     */
    parseReferences(text) {
        var refs=[], re=this.getReferenceRegEx(), match, r, cpmatch, p;
        while(match=re.exec(text)) {
            p=this.getPublication(match[1]);
            while( cpmatch=ReferenceUtil.CHAPTERPAR_REGEX.exec(match[2]) ) {
                r=new Reference(p,cpmatch[1],cpmatch[2]);
                if(r.valid()) refs.push(r);
            }
        }
        return refs;
    }

    /*
     *  getReferenceRegEx: Takes the simpler REFERENCE_REGEX constant and subs out the \w+ (word) 
     *  placeholder with all of the exact publication regexes. This way it only matches real publications.
     * 
     */
    getReferenceRegEx() {
        var booksrearray=[];
        for( var b of ReferenceUtil.PUBLICATIONS ) booksrearray.push(b.regex.source);
        return RegExp(ReferenceUtil.REFERENCE_REGEX.source.replace("\\w+",booksrearray.join("|")),ReferenceUtil.REFERENCE_REGEX.flags);
    }

    /*
     *  getPublication: Receives text and determines what Publication object it matches.
     * 
     */
    getPublication(txt) {
        var p=null;
        for( var i=0 ; i<ReferenceUtil.PUBLICATIONS.length && !p ; i++ ) {
            if( ReferenceUtil.PUBLICATIONS[i].match(txt) ) p=ReferenceUtil.PUBLICATIONS[i];
        }
        return p;
    }

}

ReferenceUtil.REFERENCE_REGEX = /\b(\w+)\s*(\d[\d\s\-\.,;:]*)/igm;
ReferenceUtil.CHAPTERPAR_REGEX = /(\d+)\s*[:\.]([\d\s\-,]+)/g;
ReferenceUtil.PUBLICATIONS = [
    new Publication( "hf", "You Can Have a Happy Family Life", /(?:hf|happy family|you can have a happy family life)/i ),
    new Publication( "ia", "Imitate Their Faith!", /(?:ia|imitate|imitate their faith)/i ),
    new Publication( "bhs", "What Does the Bible Teach?", /(?:bhs|bible teach|what does the bible teach)/i ),
    new Publication( "jl", "Who Are Doing Jehovah's Will?", /(?:jl|jehovah's will|who are doing jehovah's will)/i )
];

module.exports=ReferenceUtil;