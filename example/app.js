// This is a test harness for your module
// You should do something interesting in this harness 
// to test out the module and to provide instructions 
// to users on how to use it by example.


// open a single window
var window = Ti.UI.createWindow({
	backgroundColor:'white'
});

window.open();

// TODO: write your module tests here
var cashola = require('com.cashola');
Ti.API.info("module is => " + cashola);
/*
cashola.getProducts({
	identifiers: "blah",
	win: function (e) {
		Ti.API.debug("Got the word from G!");
	}
});
*/
cashola.getProducts({
	identifiers: ["foo", "and", "bar"],
	win: function (e) {
		Ti.API.debug("Second test");
	}
});
/*
cashola.makePurchase({
	
});
*/