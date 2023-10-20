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
	  text: msg,
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