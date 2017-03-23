const expect=require("chai").expect;
const ReferenceUtil=require("../ReferenceUtil");

describe("ReferenceUtil", function() {

    describe("Matching", function() {
        var tests=[
            {text:"Play entire hf 1 chapter.", cnt:1},
            {text:"Please check out ia 15:22-26 and stuff.", cnt:1},
            {text:"Now try ia 15:22 to see what this is about.", cnt:1},
            {text:"Try ia 15 Art please.", cnt:1},
            {text:"Now, ia 15:22, 25 is next.", cnt:1},
            {text:"Display ia 15 Art 2a please.", cnt:1},
            {text:"Try ia 14 art 1-p 3, p 8 please and thank you.", cnt:1},
            {text:"Try ia 15:22; 16:10", cnt:2},
            {text:"Try ia 15:22; 16:10; bhs 2:12", cnt:3}
        ];
        tests.forEach(function(test) {
            it(`should find ${test.cnt} match${test.cnt!=1?"es":""} in "${test.text}"`, function() {
                var util=new ReferenceUtil();
                var result=util.parseReferences(test.text);
                for( var ref of result ) console.log(ref.toString());
                expect(result.length).to.equal(test.cnt);
            });
        });
    })

});