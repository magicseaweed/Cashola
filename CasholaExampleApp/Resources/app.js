// IMPORTANT: Will not working until you include Cashola.js file.

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();


//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    title:'Tab 1',
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Tab 1',
    window:win1
});

var label1 = Titanium.UI.createButton({
	top: 100,
	left: 20,
	right: 20,
	color:'#222',
	title:'Start Checkout Flow',
	textAlign:'center',
	height: 34
});

label1.addEventListener("click", function (e) {
	Cashola.startCheckout({
		uidebug: false,
		identifiers: ["com.magicseaweed.pro"],
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

win1.add(label1);

//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({  
    title:'Tab 2',
    backgroundColor:'#fff'
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Tab 2',
    window:win2
});

var label2 = Titanium.UI.createLabel({
	color:'#999',
	text:'I am Window 2',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win2.add(label2);



//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  


// open tab group
tabGroup.open();