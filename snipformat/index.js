const copypaste = require('copy-paste');


const buffer = copypaste.paste();
const res = buffer
	.replaceAll('\n', `\\n`)
	.replaceAll('\t', `\\t`)
	.replaceAll(`\r`, `\\r`)
	.replaceAll(`"`, `\\"`);
copypaste.copy(res);
console.log(res);
