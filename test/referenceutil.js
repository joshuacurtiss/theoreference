const expect=require("chai").expect;
const ReferenceUtil=require("../ReferenceUtil");

// Test cues
const CUES={
    "ia": {
        "14": ["Start","Title","P 1","Q 1","P 2","Q 2","P 3","Jonah 3:1","Jonah 3:2","Jonah 3:3","Q 3","Subheading 1","P 4","P 5","Q 4, 5","Art 1 Caption","Art 1","P 6","Q 6","Art 2 Caption","Art 2","P 7","P 8","Jonah 3:5","Q 7, 8","P 9","Matt. 12:41","Q 9","Subheading 2","P 10","Jonah 3:10","P 11","Deut. 32:4","Q 10, 11","P 12","P 13","Q 12, 13","P 14a","Jonah 4:2","Jonah 4:3","P 14b","Q 14","P 15","Q 15","P 16","Q 16","Subheading 3","P 17","P 18","Q 17, 18","P 19","P 20","Jonah 4:10","Jonah 4:11","Q 19, 20","Art 3 Caption","Art 3","P 21","Q 21","P 22","Q 22","Review","R 1","R 2","R 3","R 4"],
        "15": ["Start","Title","P 1","P 2","P 3","Esther 4:11","Esther 5:1","Q 1-3","Subheading 1","P 4","Q 4","P 5","P 6","Q 5, 6","Art 1 Caption","Art 1","Subheading 2","P 7","Q 7","P 8","Prov. 11:22","Prov. 31:30","Q 8","P 9","Q 9","Subheading 3","P 10","P 11","Q 10, 11","P 12","P 13a","Esther 2:10","P 13b","Q 12, 13","P 14","Prov. 27:11","Q 14","P 15","Esther 2:17","P 16","Q 15, 16","Art 2 Caption","Art 2","P 17","Q 17","Subheading 4","P 18","Q 18","P 19","Q 19","P 20","P 21","Esther 3:13","Esther 3:15","Esther 4:1","Q 20, 21","P 22","Q 22","P 23","Q 23","Subheading 5","P 24","Q 24","P 25","Q 25","Art 3 Caption","Art 3","P 26","John 13:34","John 13:35","Q 26","Review","R 1","R 2","R 3","R 4"],
        "16": ["Start","Title","P 1","P 2","P 3a","Esther 5:3","P 3b","Q 1-3","Art 1 Caption","Art 1","P 4","Q 4","Subheading 1","P 5a","Eccl. 3:1","Eccl. 3:7","P 5b","P 6","Prov. 10:19","Q 5, 6","P 7","P 8","Q 7, 8","P 9a","Prov. 25:15","P 9b","Q 9","Box 1","Box 1 P 1","Box 1 P 2","Box 1 P 3","Subheading 2","P 10","P 11","Q 10, 11","P 12a","Esther 6:1","Esther 6:2","P 12b","Esther 6:3","Q 12","P 13","P 14","Q 13, 14","P 15","Mic. 7:7","Q 15","Subheading 3","P 16","P 17a","Esther 7:3","P 17b","Q 16, 17","P 18a","Esther 7:4","P 18b","Q 18","P 19","Q 19","P 20","P 21","Q 20, 21","Art 2 Caption","Art 2","P 22","Ps. 7:15","Ps. 7:16","Q 22","Subheading 4","P 23","Box 2","Box 2 P 1a","Gen. 49:27","Box 2 P 1b","Q 23","P 24","P 25","Q 24, 25","Art 3 Caption","Art 3","P 26","P 27","Q 26, 27","P 28","P 29","2 Cor. 10:3","2 Cor. 10:4","Q 28, 29","Review","R 1","R 2","R 3","R 4"]
    },
    "sn": {
        "1": ["Start","Title","Introduction","Verse 1","Verse 2","Verse 3"],
        "2": ["Start","Title","Introduction","Verse 1","Verse 2","Verse 3"]
    }
}

describe("ReferenceUtil", function() {

    describe("Matching", function() {
        var tests=[
            {text:"Play entire hf 1 chapter.", finds:"hf 1"},
            {text:"Please check out Imitate Their Faith 15:22-26 and stuff.", finds:"ia 15:22-26"},
            {text:"Now try ia 15:22 to see what this is about.", finds:"ia 15:22"},
            {text:"Try ia 15 Art please.", finds:"ia 15:Art"},
            {text:"ia 15 p3.", finds:"ia 15:3"},
            {text:"ia ch15 par 3.", finds:"ia 15:3"},
            {text:"ia ch15 p 3.", finds:"ia 15:3"},
            {text:"ia ch14 par 14a only", finds:"ia 14:14a"},
            {text:"Now, ia 15:22, 25 is next.", finds:"ia 15:22, 25"},
            {text:"Display ia 15 Art 2a please.", finds:"ia 15:Art 2a"},
            {text:"Try ia 14 art 1-p 3, p 8 please and thank you.", finds:"ia 14:Art 1-3, 8"},
            {text:"Try ia 15:22; 16:10", finds:"ia 15:22; ia 16:10"},
            {text:"Try ia 15:22; 16:10; bhs 2:12", finds:"ia 15:22; ia 16:10; bhs 2:12"},
            {text:"Check out ia 16 box 1 p 2", finds:"ia 16:Box 1 P 2"},
            {text:"ia 15:22-24-26", finds:"ia 15:22-24"}
        ];
        tests.forEach(function(test) {
            it(`"${test.text}" should find "${test.finds}"`, function() {
                var util=new ReferenceUtil();
                var result=util.parseReferences(test.text);
                var resultStrings=[];
                result.forEach((ref)=>{resultStrings.push(ref.toString())})
                expect(resultStrings.join("; ")).to.equal(test.finds);
            });
        });
    })

    describe("Cues", function() {
        var tests=[
            {text:"sn 1", cues:CUES.sn["1"]},
            {text:"ia 15:22", cues:["P 22"]},
            {text:"ia 14:14", cues:["P 14a","Jonah 4:2","Jonah 4:3","P 14b"]},
            {text:"ia 16:1-3", cues:["P 1","P 2","P 3a","Esther 5:3","P 3b"]},
            {text:"ia 16:6", cues:["P 6","Prov. 10:19"]},
            {text:"ia 16:5-6", cues:["P 5a","Eccl. 3:1","Eccl. 3:7","P 5b","P 6","Prov. 10:19"]},
            {text:"ia 14:99", cues:[]}
        ];
        tests.forEach(function(test) {
            it(`"${test.text}" should have cues: "${test.cues.join(', ')}"`, function() {
                var util=new ReferenceUtil();
                var result=util.parseReferences(test.text);
                if(result.length) result=result[0];
                result.availableCues=CUES[result.publication.symbol][result.chapter];
                expect(result.cues.length).to.equal(test.cues.length);
                expect(result.cues.join(", ")).to.equal(test.cues.join(", "));
            });
        });
    })

});