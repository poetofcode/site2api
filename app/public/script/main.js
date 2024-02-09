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

function showToast(msg, isError) {
	Toastify({
	  text: !isError ? 'Ok' : msg,
	  duration: 3000,
	  // destination: "https://github.com/apvarun/toastify-js",
	  newWindow: true,
	  close: true,
	  gravity: "bottom", // `top` or `bottom`
	  position: "center", // `left`, `center` or `right`
	  stopOnFocus: true, // Prevents dismissing of toast on hover
	  style: {
	    background: isError ? "#e2512e" : "#00b09b",
	  },
	  onClick: function(){} // Callback after click
	}).showToast();
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

String.prototype.escapeSpecialChars = function() {
    return this.replace(/\\n/g, "\\n")
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f");
};