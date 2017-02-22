let Publication=require("./Publication.js");
let Reference=require("./Reference.js");
let ReferenceVideo=require("./ReferenceVideo.js");
let fs=require("fs-extra");

class ReferenceUtil {

    constructor(videopath) {
        // Video path is the path under which all video files are housed. Subdirectories ok.
        this.videopath=videopath;
        return this;
    }

    get videopath(){return this._videopath}
    set videopath(path) {
        this._videopath=path||"";
        // Keep a list of all the videos
        var pathwalk=fs.walkSync(this.videopath);
        var videos=[], webvtts=[], f, ext;
        for( var path of pathwalk ) {
            f=path.split("/").pop();
            ext=f.split(".").pop().toLowerCase();
            if( ReferenceUtil.VIDEOEXT.indexOf(ext)>=0 ) videos.push(path);
            else if( ReferenceUtil.WEBVTTEXT.indexOf(ext)>=0 ) webvtts.push(path);
        }
        this.videos=videos.reverse(); // Reverse to get higher def versions as first choice.
        this.webvtts=webvtts;
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

    /*
     *  createVideo: Receives a publication and returns a ScriptureVideo object
     *  that knows how to exactly play that scripture from the video.
     * 
     */
    createVideo(reference) {
        // RegEx: /BOOKSYMBOL_something_CHAPTER_r999p.ext
        if( reference.valid() ) {
            var chapter="0*"+reference.chapter.toString();
            var baseFileRegex=
                "\/"+
                reference.publication.symbol+"_"+
                "\\w+_"+
                chapter+"_"+
                "r\\d{3}p\\.\\w{3}";
            var videoRegex=new RegExp(baseFileRegex+"$","i");
            var webvttRegex=new RegExp(baseFileRegex+"\\.\\w{3,6}$","i");
            var videoFile=this.videos.find((value)=>{return videoRegex.test(value)});
            var webvttFile=this.webvtts.find((value)=>{return webvttRegex.test(value)});
            // TODO: Handle if file doesn't exist, create webvtt on the fly.
            var webvtt="";
            try {
                webvtt=fs.readFileSync(webvttFile,"UTF-8");
            } catch (error) {}
            return new ReferenceVideo(reference,videoFile,webvtt);
        }
    }

}

ReferenceUtil.REFERENCE_REGEX = /\b(\w+)\s*(\d[\d\s\-\.,;:]*)/igm;
ReferenceUtil.CHAPTERPAR_REGEX = /(\d+)\s*[:\.]([\d\s\-,]+)/g;
ReferenceUtil.VIDEOEXT = ["mp4","m4v","mov"];
ReferenceUtil.WEBVTTEXT = ["webvtt","vtt"];
ReferenceUtil.PUBLICATIONS = [
    new Publication( "hf", "You Can Have a Happy Family Life", /(?:hf|happy family|you can have a happy family life)/i ),
    new Publication( "ia", "Imitate Their Faith!", /(?:ia|imitate|imitate their faith)/i ),
    new Publication( "bhs", "What Does the Bible Teach?", /(?:bhs|bible teach|what does the bible teach)/i ),
    new Publication( "jl", "Who Are Doing Jehovah's Will?", /(?:jl|jehovah's will|who are doing jehovah's will)/i )
];

module.exports=ReferenceUtil;