const Publication=require("./Publication");
const Reference=require("./Reference");
const REGEX=require("./RegEx");

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
        var refs=this.parseReferencesWithIndex(text);
        return refs.map(ref=>ref.obj);
    }

    parseReferencesWithIndex(text) {
        var refs=[], refre=this.getReferenceRegEx(), chaptercueRE=this.getChapterCueRegEx(), match, cumatch, r, cpmatch, p;
        while(match=refre.exec(text)) {
            p=this.getPublication(match[1]);
            while( cumatch=chaptercueRE.exec(match[2]) ) {
                r=new Reference(p,cumatch[1],cumatch[2]);
                if(r.valid()) refs.push({obj:r,index:match.index});
            }
        }
        return refs;
    }

    /*
     *  RegEx Getters: Take the simpler regex constants and subs out parts of it. 
     *  For Reference RegEx, the \w+ (word) placeholder replaced with all of the exact publication regexes.
     *  Also sub out the CUESWITHNUMBERS and CUENUMBER placeholders.
     * 
     */
    getReferenceRegEx() {
        var pubsrearray=[];
        for( var p of ReferenceUtil.PUBLICATIONS ) pubsrearray.push(p.regex.source);
        var source=REGEX.REFERENCE_REGEX.source
                .replace("\\w+",pubsrearray.join("|"))
                .replace(/CUESWITHNUMBERS/g,REGEX.CUESWITHNUMBERS_REGEX.source)
                .replace(/CUENUMBER/g,REGEX.CUENUMBER_REGEX.source)
                .replace(/CUESMISC/g,REGEX.CUESMISC_REGEX.source);
        return RegExp(source,REGEX.REFERENCE_REGEX.flags);
    }
    getChapterCueRegEx() {
        var source=REGEX.CHAPTERCUE_REGEX.source
                .replace(/CUESWITHNUMBERS/g,REGEX.CUESWITHNUMBERS_REGEX.source)
                .replace(/CUENUMBER/g,REGEX.CUENUMBER_REGEX.source)
                .replace(/CUESMISC/g,REGEX.CUESMISC_REGEX.source);
        return RegExp(source,REGEX.CHAPTERCUE_REGEX.flags);
    }

    /*
     *  getPublication: Receives text and determines what Publication object it matches.
     * 
     */
    getPublication(txt) {
        var p=null;
        // Loop thru publications and find the one it matches based on publication regex
        for( var i=0 ; i<ReferenceUtil.PUBLICATIONS.length && !p ; i++ ) {
            if( ReferenceUtil.PUBLICATIONS[i].match(txt) ) {
                p=ReferenceUtil.PUBLICATIONS[i];
                // If it is date-based, though, instantiate a new Publication with the matching date.
                if( p.hasDates && ReferenceUtil.DATE_REGEX.hasOwnProperty(p.symbol) ) {
                    var datepub=new Publication(p.symbol,p.name,p.regex,true);
                    // Match up date, set "1" for missing month/day, sanitize year, etc. 
                    var RE=ReferenceUtil.DATE_REGEX[p.symbol];
                    var datematch=RE.REGEX.exec(txt)
                    var year=parseInt(datematch[RE.YEAR]);
                    if(year<100) year+=(year<30)?2000:1900; // Threshold is 2030
                    // Handle month as a string or a number
                    var month=datematch[RE.MONTH] || 1;
                    if( ! isNaN(month) ) month=parseInt(month)-1;
                    var day=isNaN(datematch[RE.DAY])?1:parseInt(datematch[RE.DAY]);
                    // If month is a string, pass a string to Date constructor. Otherwise, pass numerics.
                    if( isNaN(month) ) datepub.date=new Date(`${month} ${day}, ${year}`);
                    else datepub.date=new Date(year,month,day);
                    p=datepub;
                }
            }
        }
        return p;
    }

}

// TODO: Note how this matches Watchtower public (wp), study (w), and simplified (ws) editions. Will need logic for this.
ReferenceUtil.DATE_REGEX={
    "w": {REGEX:/\w+\s*((?:\d\d)?\d\d)[\s\.]+(\d\d?)(?:\/(\d\d?))?/i,YEAR:1,MONTH:2,DAY:3},
    "yb": {REGEX:/\w+\s*((?:\d\d)?\d\d)/i,YEAR:1,MONTH:2,DAY:3},
    "km": {REGEX:/[a-z ]*(\d\d?)\/((?:\d\d)?\d\d)/i,MONTH:1,YEAR:2,DAY:3},
    "mwb": {REGEX:/[a-z ]*((?:\d\d)?\d\d)\s*(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:t|tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)/i,YEAR:1,MONTH:2,DAY:3}
};

ReferenceUtil.PUBLICATIONS = [
    
    /* Date-based publications */
    new Publication( "w", "Watchtower", /(?:watchtower|wt|wp|ws|w)\s*(?:(?:\d\d)?\d\d[\s\.]+\d\d?(?:\/\d\d?)?)/i, true ),
    new Publication( "yb", "Yearbook", /(?:(?:yearbook|yb)\s*(?:\d\d)?\d\d)/i, true ),
    new Publication( "km", "Kingdom Ministry", /(?:kingdom ministry|okm|km)\s*\d\d?\/(?:\d\d)?\d\d/i, true ),
    new Publication( "mwb", "Life and Ministry Meeting Workbook", /(?:(?:life and ministry )?meeting workbook|mwb)\s*(?:\d\d)?\d\d\s*(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:t|tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)/i, true ),

    /* Video-only publications */
    new Publication( "pksjj", "Become Jehovah's Friend Songs", /(?:pksjj|(?:become )?jehovah'?s friend songs?)/i ),
    new Publication( "pk", "Become Jehovah's Friend", /(?:pk|(?:become )?jehovah'?s friend)/i ),

    /* Tracts */
    new Publication( "t-30", "How Do You View the Bible?", /(?:T-30|How Do You View the Bible\??)/i ),
    new Publication( "t-33", "Who Really Controls the World?", /(?:T-33|Who Really Controls the World\??)/i ),
    new Publication( "t-34", "Will Suffering Ever End?", /(?:T-34|Will Suffering Ever End\??)/i ),
    new Publication( "t-35", "Can the Dead Really Live Again?", /(?:T-35|Can the Dead Really Live Again\??)/i ),
    new Publication( "t-36", "What Is the Kingdom of God?", /(?:T-36|What Is the Kingdom of God\??)/i ),

    /* Normal Publications */
    new Publication( "ba", "A Book for All People", /(?:ba|book for all people|book for all)/i ), 
    new Publication( "be", "Benefit From Theocratic Ministry School Education", /(?:be|benefit from theocratic ministry school education|ministry school|benefit)/i ),
    new Publication( "bh", "What Does the Bible Really Teach?", /(?:bh|what does the bible really teach|bible teach)\??/i ), 
    new Publication( "bhs", "What Can the Bible Teach Us?", /(?:bhs|what can the bible teach us|teach us)\??/i ), 
    new Publication( "bm", "The Bible—What Is Its Message?", /(?:bm|the bible-what is its message|bible message)\??/i ), 
    new Publication( "bp", "The Government That Will Bring Paradise", /(?:bp|the government that will bring paradise|bring paradise)/i ), 
    new Publication( "bt", "\"Bearing Thorough Witness\" About God's Kingdom", /(?:bt|"?bearing thorough witness"? about god'?s kingdom|bearing thorough witness)/i ), 
    new Publication( "cf", "Come Be My Follower", /(?:cf|come be my follower|my follower)/i ), 
    new Publication( "cl", "Draw Close to Jehovah", /(?:cl|draw close to jehovah|draw close)/i ), 
    new Publication( "ct", "Is There a Creator Who Cares About You?", /(?:ct|is there a creator who cares about you|is there a creator|creator)\??/i ), 
    new Publication( "dg", "Does God Really Care About Us?", /(?:dg|does god really care about us|does god care)\??/i ), 
    new Publication( "dp", "Pay Attention to Daniel's Prophecy!", /(?:dp|pay attention to daniel'?s prophecy|daniel'?s prophecy)!?/i ), 
    new Publication( "fg", "Good News From God!", /(?:fg|good news(?: from god)?!?)/i ), 
    new Publication( "fy", "The Secret of Family Happiness", /(?:fy|(?:the )?(?:secret of )?family hapiness)/i ), 
    new Publication( "gf", "You Can Be God's Friend!", /(?:gf|(?:you can be )?god'?s friend!?)/i ), 
    new Publication( "gt", "The Greatest Man Who Ever Lived", /(?:gt|(?:the )?greatest man(?: who ever lived)?)/i ), 
    new Publication( "hf", "Your Family Can Be Happy", /(?:hf|your family can be happy|happy family)/i ), 
    new Publication( "hl", "How Can You Have a Happy Life?", /(?:hl|how can you have a happy life|happy life)\??/i ), 
    new Publication( "ia", "Imitate Their Faith", /(?:ia|imitate their faith|imitate)/i ), 
    new Publication( "jl", "Who Are Doing Jehovah's Will Today?", /(?:jl|who are doing jehovah's will|jehovah's will)/i ), 
    new Publication( "ll", "Listen to God and Live Forever", /(?:ll|listen to god and live forever|listen to god|listen and live)/i ), 
    new Publication( "Lmn", "\"Look! I Am Making All Things New\"", /(?:lmn|look!? i am making all things new|look!?)/i ), 
    new Publication( "lr", "Learn From the Great Teacher", /(?:lr|learn from the great teacher)/i ), 
    new Publication( "lv", "Keep Yourselves in God's Love", /(?:lv|keep yourselves in god'?s love|god'?s love)/i ), 
    new Publication( "my", "My Book of Bible Stories", /(?:(?:my book of )?bible stories|my)/i ), 
    new Publication( "rj", "Return to Jehovah", /(?:rj|return to jehovah)/i ), 
    new Publication( "sn", "Sing to Jehovah", /(?:sn|sing to jehovah|sing|songs|song)/i ),
    new Publication( "snnw", "Sing to Jehovah-New Songs", /(?:snnw|sing to jehovah\-new songs|sing new|new songs|new song)/i ),
    new Publication( "sp", "Spirits of the Dead—Can They Help You or Harm You? Do They Really Exist?", /(?:spirits(?: of the dead)|Spirits of the Dead\—Can They Help You or Harm You\?? Do They Really Exist\??|sp)/i ), 
    new Publication( "we", "When Someone You Love Dies", /(?:when someone you love dies|we)/i ), 
    new Publication( "ypq", "Answers to 10 Questions Young People Ask", /(?:ypq|answers|answers to 10 questions young people ask|answers to 10 questions)/i )

    /* Publications to be excluded for now */
    /*
    new Publication( "br78", "Jehovah's Witnesses in the Twentieth Century", /XXXX/i ), 
    new Publication( "ed", "Jehovah's Witnesses and Education", /XXXX/i ), 
    new Publication( "gl", "\"See the Good Land\"", /XXXX/i ), 
    new Publication( "gm", "The Bible—God's Word or Man's?", /XXXX/i ), 
    new Publication( "gu", "The Guidance of God—Our Way to Paradise", /XXXX/i ), 
    new Publication( "hb", "How Can Blood Save Your Life?", /XXXX/i ), 
    new Publication( "ie", "What Happens to Us When We Die?", /XXXX/i ), 
    new Publication( "ip-1", "Isaiah's Prophecy—Light for All Mankind I", /XXXX/i ), 
    new Publication( "ip-2", "Isaiah's Prophecy—Light for All Mankind II", /XXXX/i ), 
    new Publication( "it-1", "Insight on the Scriptures, Volume 1", /XXXX/i ), 
    new Publication( "it-2", "Insight on the Scriptures, Volume 2", /XXXX/i ), 
    new Publication( "jd", "Live With Jehovah's Day in Mind", /XXXX/i ), 
    new Publication( "je", "Jehovah's Witnesses—Unitedly Doing God's Will Worldwide", /XXXX/i ), 
    new Publication( "jr", "God's Word for Us Through Jeremiah", /XXXX/i ), 
    new Publication( "jt", "Jehovah's Witnesses—Who Are They? What Do They Believe?", /XXXX/i ), 
    new Publication( "jv", "Jehovah's Witnesses—Proclaimers of God's Kingdom", /XXXX/i ), 
    new Publication( "jy", "Jesus—The Way, the Truth, the Life", /XXXX/i ), 
    new Publication( "kl", "Knowledge That Leads to Everlasting Life", /XXXX/i ), 
    new Publication( "kp", "Keep on the Watch!", /XXXX/i ), 
    new Publication( "kr", "God's Kingdom Rules!", /XXXX/i ), 
    new Publication( "la", "A Satisfying Life—How to Attain It", /XXXX/i ), 
    new Publication( "lc", "Was Life Created?", /XXXX/i ), 
    new Publication( "ld", "Listen to God", /XXXX/i ), 
    new Publication( "lf", "The Origin of Life—Five Questions Worth Asking", /XXXX/i ), 
    new Publication( "mb", "My Bible Lessons", /XXXX/i ), 
    new Publication( "od", "Organized to Do Jehovah's Will", /XXXX/i ), 
    new Publication( "ol", "The Road to Everlasting Life—Have You Found It?", /XXXX/i ), 
    new Publication( "om", "Organized to Accomplish Our Ministry", /XXXX/i ), 
    new Publication( "op", "Our Problems—Who Will Help Us Solve Them?", /XXXX/i ), 
    new Publication( "pc", "Lasting Peace and Happiness—How to Find Them", /XXXX/i ), 
    new Publication( "pe", "You Can Live Forever in Paradise on Earth", /XXXX/i ), 
    new Publication( "ph", "The Pathway to Peace and Happiness", /XXXX/i ), 
    new Publication( "pr", "What Is the Purpose of Life? How Can You Find It?", /XXXX/i ), 
    new Publication( "re", "Revelation—Its Grand Climax At Hand!", /XXXX/i ), 
    new Publication( "rk", "Real Faith—Your Key to a Happy Life", /XXXX/i ), 
    new Publication( "rq", "What Does God Require of Us?", /XXXX/i ), 
    new Publication( "rs", "Reasoning From the Scriptures", /XXXX/i ), 
    new Publication( "sg", "Theocratic Ministry School Guidebook", /XXXX/i ), 
    new Publication( "sh", "Mankind's Search for God", /XXXX/i ), 
    new Publication( "si", "All Scripture Is Inspired of God and Beneficial", /XXXX/i ), 
    new Publication( "ti", "Should You Believe in the Trinity?", /XXXX/i ), 
    new Publication( "tp", "True Peace and Security—How Can You Find It?", /XXXX/i ), 
    new Publication( "vi", "Victory Over Death—Is It Possible for You?", /XXXX/i ), 
    new Publication( "wi", "Will There Ever Be a World Without War?", /XXXX/i ), 
    new Publication( "wj", "Why Should We Worship God in Love and Truth?", /XXXX/i ), 
    new Publication( "ws", "Worldwide Security Under the \"Prince of Peace\"", /XXXX/i ), 
    new Publication( "wt", "Worship the Only True God", /XXXX/i ), 
    new Publication( "yc", "Teach Your Children", /XXXX/i ), 
    new Publication( "yp", "Questions Young People Ask—Answers That Work", /XXXX/i ), 
    new Publication( "yp1", "Questions Young People Ask—Answers That Work, Volume 1", /XXXX/i ), 
    new Publication( "yp2", "Questions Young People Ask—Answers That Work, Volume 2", /XXXX/i ), 
    */

];

module.exports=ReferenceUtil;