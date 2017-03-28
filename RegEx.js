// TODO: Add CUEMISC regex to this regex.
// TODO: Allow "ia ch5, p4" or "Imitate Their Faith, ch5 par4", namely, using comma after pub or chapter
module.exports={
    REFERENCE_REGEX: /\b(\w+)((?:\s*(?:ch|chapter)?\s*(?:\d+)\s*[:\.]?\s*(?:(?:CUESWITHNUMBERS\s*CUENUMBER?|\d+)(?:\s*[\-,]\s*(?:CUESWITHNUMBERS\s*CUENUMBER?|\d+))*)*;*)*)\b/gi,
    CHAPTERCUE_REGEX: /(?:ch|chapter)?\s*(\d+)\s*[:\.]?\s*((?:CUESWITHNUMBERS\s*CUENUMBER?|\d+)(?:\s*[\-,]\s*(?:CUESWITHNUMBERS\s*CUENUMBER?|\d+))*)*/gi,
    CUESWITHNUMBERS_REGEX: /(?:art caption|presentation intro|article|service meeting|subheading|verse|summary|art|box|par|question|review|presentation|p|q|r)/i,
    CUENUMBER_REGEX: /(?:\d{1,2}[a-f]?)/i,
    PARBOUNDARY_REGEX: /^(subheading|box|art|par|review|p|q|r)\s/i,
    CUESMISC_REGEX: /(start|title|introduction|chorus|publication title|title page|article questions|opening questions)/i
};