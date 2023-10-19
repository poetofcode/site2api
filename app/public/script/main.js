$(function() {

});

function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

function codeEscape(buffer) {
	const res = buffer
		.replaceAll('\n', `\\n`)
		.replaceAll('\t', `\\t`)
		.replaceAll(`\r`, `\\r`)
		.replaceAll(`"`, `\\"`);
	return res;
}