const fs = require('fs');
const list = JSON.parse(fs.readFileSync('d:\\NextProject\\Oxy Pdf\\scratch\\untranslated-tools-pairs.json', 'utf8'));

console.log("=== FINDING COMMON UNTRANSLATED MESSAGES ===");

const commonPairs = list.filter(item => item.keys.length >= 2);
console.log(`Found ${commonPairs.length} common untranslated pairs (used by >= 2 keys).`);

// Save to a compact file for manual/local processing
fs.writeFileSync('d:\\NextProject\\Oxy Pdf\\scratch\\common-untranslated.json', JSON.stringify(commonPairs, null, 2), 'utf8');
console.log("Saved to scratch/common-untranslated.json");
