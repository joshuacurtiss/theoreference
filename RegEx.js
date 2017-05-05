// TODO: Allow "ia ch5, p4" or "Imitate Their Faith, ch5 par4", namely, using comma after pub or chapter
module.exports={
    REFERENCE_REGEX: /\b(\w+)((?:\s*(?:ch|chapter)?\s*(?:\d+)\s*[:\.]?\s*(?:(?:CUESWITHNUMBERS\s*CUENUMBER?|\d+|CUESMISC)(?:\s*[\-,]\s*(?:CUESWITHNUMBERS\s*CUENUMBER?|\d+|CUESMISC))*)*;*)*)\b/gi,
    CHAPTERCUE_REGEX: /(?:ch|chapter)?\s*(\d+)\s*[:\.]?\s*((?:CUESWITHNUMBERS\s*CUENUMBER?|\d+|CUESMISC)(?:\s*[\-,]\s*(?:CUESWITHNUMBERS\s*CUENUMBER?|\d+|CUESMISC))*)*/gi,
    CUESWITHNUMBERS_REGEX: /(?:art\s*\d?\s*(?:caption|start|end)|presentation intro|article|service meeting|subheading|verse|summary|art|box \d+ p|box|par|question|review|presentation|p|q|r)/i,
    CUENUMBER_REGEX: /(?:\d{1,2}[a-f]?)/i,
    PARBOUNDARY_REGEX: /^(subheading|box|art|par|review|presentation|build|#\d|p\s|q\s|r\s)/i,
    CUESMISC_REGEX: /(start|title|introduction|chorus|publication title|title page|article questions|opening questions)/i
};
