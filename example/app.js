// Include the JS UI helpers.
// You can roll your own UI if you like and use the cashola module directly.
// Or include this helper library, modify it or overwrite any UI building functions.
Ti.include("Cashola-0.1.js");

// open a single window
var window = Ti.UI.createWindow({
	backgroundColor:'white'
});

var start = Ti.UI.createButton({
	top: 20,
	left: 20,
	right: 20,
	color:'#222',
	title:'Start Checkout Flow',
	textAlign:'center',
	height: 34
});

window.add(start);

start.addEventListener("click", function (e) {
	Cashola.startCheckout({
		uidebug: false,
		identifiers: ["com.my.product"],
		restoreDetails: "You should do this stuff to restore your purchases.",
		win: function (product) {
			alert("Cashola.startCheckout.win - made purchase");
		},
		closed: function () { // Called when the checkout ends.
			alert("Cashola.startCheckout.closed");
		},
		error: function (e) { // There was an error.
			alert("Cashola.startCheckout.error");
		}
	});
});

window.open();

// TODO: write your module tests here
var cashola = require('com.cashola');
Ti.API.info("module is => " + cashola);