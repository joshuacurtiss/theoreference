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
            // TODO: Add support for CHAPTERPAR regex and restore this loop. 
            // while( cpmatch=ReferenceUtil.CHAPTERPAR_REGEX.exec(match[2]) ) {
            r=new Reference(p,match[2],match[3]);
            if(r.valid()) refs.push(r);
            // }
        }
        return refs;
    }

    /*
     *  getReferenceRegEx: Takes the simpler REFERENCE_REGEX constant and subs out the \w+ (word) 
     *  placeholder with all of the exact publication regexes. This way it only matches real publications.
     * 
     */
    getReferenceRegEx() {
        var pubsrearray=[];
        for( var p of ReferenceUtil.PUBLICATIONS ) pubsrearray.push(p.regex.source);
        var source=ReferenceUtil.REFERENCE_REGEX.source
                .replace("\\w+",pubsrearray.join("|"))
                .replace(/CUESWITHNUMBERS/g,ReferenceUtil.CUESWITHNUMBERS_REGEX.source)
                .replace(/CUENUMBER/g,ReferenceUtil.CUENUMBER_REGEX.source);
        return RegExp(source,ReferenceUtil.REFERENCE_REGEX.flags);
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

// TODO: Set up this regex to undestand semicolons. Get chapterpar regex to match this new code.
// TODO: Add CUEMISC regex to this regex.
ReferenceUtil.REFERENCE_REGEX = /\b(\w+)\s*(\d+)\s*[:\.]{0,1}\s*((?:CUESWITHNUMBERS\s*CUENUMBER|\d+)(\s*[\-,]\s*(?:CUESWITHNUMBERS\s*CUENUMBER|\d+))*)*\b/igm;
ReferenceUtil.CHAPTERPAR_REGEX = /(\d+)\s*[:\.]([\d\s\-,]+)/g;
ReferenceUtil.CUESWITHNUMBERS_REGEX = /(art|art caption|box|p|q|r|review|presentation|presentation intro|article|service meeting|subheading|verse|summary)/i
ReferenceUtil.CUENUMBER_REGEX = /(?:\d{1,2}[a-f]{0,1}){0,1}/i
ReferenceUtil.CUESMISC_REGEX = /(start|title|introduction|chorus|publication title|title page|article questions|opening questions)/i

// TODO: Obviously, add more publications.
ReferenceUtil.PUBLICATIONS = [
    new Publication( "hf", "You Can Have a Happy Family Life", /(?:hf|happy family|you can have a happy family life)/i ),
    new Publication( "ia", "Imitate Their Faith!", /(?:ia|imitate|imitate their faith)/i ),
    new Publication( "bhs", "What Does the Bible Teach?", /(?:bhs|bible teach|what does the bible teach)/i ),
    new Publication( "jl", "Who Are Doing Jehovah's Will?", /(?:jl|jehovah's will|who are doing jehovah's will)/i )
];

module.exports=ReferenceUtil;