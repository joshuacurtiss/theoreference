const expect=require("chai").expect;
const Reference=require("../Reference");
var ref=new Reference();

describe("Reference", function() {

    describe("sanitizeChapter", function() {
        var tests=[
            {text:"4", becomes:"4"},
            {text:"ch4", becomes:"4"},
            {text:"ch 12", becomes:"12"},
            {text:"chapter 4", becomes:"4"},
            {text:"chapter4", becomes:"4"}
        ];
        tests.forEach(function(test) {
            it(`"${test.text}" should become "${test.becomes}"`, function() {
                expect(ref.sanitizeChapter(test.text)).to.equal(test.becomes);
            });
        });
    })

    describe("sanitizePar", function() {
        var tests=[
            {text:"14", becomes:"14"},
            {text:"Art 2", becomes:"Art 2"},
            {text:"p 4", becomes:"4"},
            {text:"par 12", becomes:"12"},
            {text:"p4", becomes:"4"},
            {text:"par4", becomes:"4"},
            {text:"q2", becomes:"Q 2"},
            {text:"question 2", becomes:"Q 2"},
            {text:"r 4", becomes:"R 4"},
            {text:"Box 2", becomes:"Box 2"},
            {text:"box2", becomes:"Box 2"},
            {text:"review 4", becomes:"Review 4"}
        ];
        tests.forEach(function(test) {
            it(`"${test.text}" should become "${test.becomes}"`, function() {
                expect(ref.sanitizePar(test.text)).to.equal(test.becomes);
            });
        });
    })

});