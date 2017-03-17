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

// TODO: How to handle yearbook, watchtower, watchtower simplified, okm, mwb? 
// TODO: Obviously, add more publications.
ReferenceUtil.PUBLICATIONS = [
    new Publication( "ba", "A Book for All People", /XXXX/i ), 
    new Publication( "be", "Benefit From Theocratic Ministry School Education", /XXXX/i ),
    new Publication( "bh", "What Does the Bible Really Teach?", /XXXX/i ), 
    new Publication( "bhs", "What Can the Bible Teach Us?", /(?:bhs|bible teach|what does the bible teach)/i ), 
    new Publication( "bm", "The Bible—What Is Its Message?", /XXXX/i ), 
    new Publication( "bp", "The Government That Will Bring Paradise", /XXXX/i ), 
    new Publication( "br78", "Jehovah’s Witnesses in the Twentieth Century", /XXXX/i ), 
    new Publication( "bt", "“Bearing Thorough Witness” About God’s Kingdom", /XXXX/i ), 
    new Publication( "cf", "Come Be My Follower", /XXXX/i ), 
    new Publication( "cl", "Draw Close to Jehovah", /XXXX/i ), 
    new Publication( "ct", "Is There a Creator Who Cares About You?", /XXXX/i ), 
    new Publication( "dg", "Does God Really Care About Us?", /XXXX/i ), 
    new Publication( "dp", "Pay Attention to Daniel’s Prophecy!", /XXXX/i ), 
    new Publication( "ed", "Jehovah’s Witnesses and Education", /XXXX/i ), 
    new Publication( "fg", "Good News From God!", /XXXX/i ), 
    new Publication( "fy", "The Secret of Family Happiness", /XXXX/i ), 
    new Publication( "gf", "You Can Be God’s Friend!", /XXXX/i ), 
    new Publication( "gl", "“See the Good Land”", /XXXX/i ), 
    new Publication( "gm", "The Bible—God’s Word or Man’s?", /XXXX/i ), 
    new Publication( "gt", "The Greatest Man Who Ever Lived", /XXXX/i ), 
    new Publication( "gu", "The Guidance of God—Our Way to Paradise", /XXXX/i ), 
    new Publication( "hb", "How Can Blood Save Your Life?", /XXXX/i ), 
    new Publication( "hf", "Your Family Can Be Happy", /(?:hf|happy family|your family can be happy)/i ), 
    new Publication( "hl", "How Can You Have a Happy Life?", /XXXX/i ), 
    new Publication( "ia", "Imitate Their Faith", /(?:ia|imitate|imitate their faith)/i ), 
    new Publication( "ie", "What Happens to Us When We Die?", /XXXX/i ), 
    new Publication( "ip-1", "Isaiah’s Prophecy—Light for All Mankind I", /XXXX/i ), 
    new Publication( "ip-2", "Isaiah’s Prophecy—Light for All Mankind II", /XXXX/i ), 
    new Publication( "it-1", "Insight on the Scriptures, Volume 1", /XXXX/i ), 
    new Publication( "it-2", "Insight on the Scriptures, Volume 2", /XXXX/i ), 
    new Publication( "jd", "Live With Jehovah’s Day in Mind", /XXXX/i ), 
    new Publication( "je", "Jehovah’s Witnesses—Unitedly Doing God’s Will Worldwide", /XXXX/i ), 
    new Publication( "jl", "Who Are Doing Jehovah’s Will Today?", /(?:jl|jehovah's will|who are doing jehovah's will)/i ), 
    new Publication( "jr", "God’s Word for Us Through Jeremiah", /XXXX/i ), 
    new Publication( "jt", "Jehovah’s Witnesses—Who Are They? What Do They Believe?", /XXXX/i ), 
    new Publication( "jv", "Jehovah’s Witnesses—Proclaimers of God’s Kingdom", /XXXX/i ), 
    new Publication( "jy", "Jesus—The Way, the Truth, the Life", /XXXX/i ), 
    new Publication( "kl", "Knowledge That Leads to Everlasting Life", /XXXX/i ), 
    new Publication( "kp", "Keep on the Watch!", /XXXX/i ), 
    new Publication( "kr", "God’s Kingdom Rules!", /XXXX/i ), 
    new Publication( "la", "A Satisfying Life—How to Attain It", /XXXX/i ), 
    new Publication( "lc", "Was Life Created?", /XXXX/i ), 
    new Publication( "ld", "Listen to God", /XXXX/i ), 
    new Publication( "lf", "The Origin of Life—Five Questions Worth Asking", /XXXX/i ), 
    new Publication( "ll", "Listen to God and Live Forever", /XXXX/i ), 
    new Publication( "Lmn", "“Look! I Am Making All Things New”", /XXXX/i ), 
    new Publication( "lr", "Learn From the Great Teacher", /XXXX/i ), 
    new Publication( "lv", "Keep Yourselves in God’s Love", /XXXX/i ), 
    new Publication( "mb", "My Bible Lessons", /XXXX/i ), 
    new Publication( "my", "My Book of Bible Stories", /XXXX/i ), 
    new Publication( "od", "Organized to Do Jehovah’s Will", /XXXX/i ), 
    new Publication( "ol", "The Road to Everlasting Life—Have You Found It?", /XXXX/i ), 
    new Publication( "om", "Organized to Accomplish Our Ministry", /XXXX/i ), 
    new Publication( "op", "Our Problems—Who Will Help Us Solve Them?", /XXXX/i ), 
    new Publication( "pc", "Lasting Peace and Happiness—How to Find Them", /XXXX/i ), 
    new Publication( "pe", "You Can Live Forever in Paradise on Earth", /XXXX/i ), 
    new Publication( "ph", "The Pathway to Peace and Happiness", /XXXX/i ), 
    new Publication( "pr", "What Is the Purpose of Life? How Can You Find It?", /XXXX/i ), 
    new Publication( "re", "Revelation—Its Grand Climax At Hand!", /XXXX/i ), 
    new Publication( "rj", "Return to Jehovah", /XXXX/i ), 
    new Publication( "rk", "Real Faith—Your Key to a Happy Life", /XXXX/i ), 
    new Publication( "rq", "What Does God Require of Us?", /XXXX/i ), 
    new Publication( "rs", "Reasoning From the Scriptures", /XXXX/i ), 
    new Publication( "sg", "Theocratic Ministry School Guidebook", /XXXX/i ), 
    new Publication( "sh", "Mankind’s Search for God", /XXXX/i ), 
    new Publication( "si", "All Scripture Is Inspired of God and Beneficial", /XXXX/i ), 
    new Publication( "sp", "Spirits of the Dead—Can They Help You or Harm You? Do They Really Exist?", /XXXX/i ), 
    new Publication( "ti", "Should You Believe in the Trinity?", /XXXX/i ), 
    new Publication( "tp", "True Peace and Security—How Can You Find It?", /XXXX/i ), 
    new Publication( "vi", "Victory Over Death—Is It Possible for You?", /XXXX/i ), 
    new Publication( "we", "When Someone You Love Dies", /XXXX/i ), 
    new Publication( "wi", "Will There Ever Be a World Without War?", /XXXX/i ), 
    new Publication( "wj", "Why Should We Worship God in Love and Truth?", /XXXX/i ), 
    new Publication( "ws", "Worldwide Security Under the “Prince of Peace”", /XXXX/i ), 
    new Publication( "wt", "Worship the Only True God", /XXXX/i ), 
    new Publication( "yc", "Teach Your Children", /XXXX/i ), 
    new Publication( "yp", "Questions Young People Ask—Answers That Work", /XXXX/i ), 
    new Publication( "yp1", "Questions Young People Ask—Answers That Work, Volume 1", /XXXX/i ), 
    new Publication( "yp2", "Questions Young People Ask—Answers That Work, Volume 2", /XXXX/i ), 
    new Publication( "ypq", "Answers to 10 Questions Young People Ask", /XXXX/i )
];

module.exports=ReferenceUtil;