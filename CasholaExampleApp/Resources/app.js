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
		uidebug: true,
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

var Cashola = (function () {
	var loadingView = false;

	var showLoadingView = function (win, opts) {
		opts = opts || {};
	
		if (loadingView === false) {
			loadingView = Ti.UI.createView({
				width: 120,
				height: 60,
				backgroundColor: "#000",
				opcaity: 0.8,
				borderRadius: 10,
				top: ((420 - 20 - 44 - 44) / 2) - 30,
				left: ((320 / 2) - 60),
				zIndex: 1000
			});
				
			var act = Ti.UI.createActivityIndicator({
				left: (120 / 2) - 20,
				width: 40,
				height: 40,
				top: 0,
				style: Ti.UI.iPhone.ActivityIndicatorStyle.LIGHT
			});
			
			var lbl = Ti.UI.createLabel({
				bottom: 5,
				left: 0,
				height: 20,
				text: "Loading...",
				color: "#fff",
				textAlign: "center",
				font: {
					fontSize: 14,
					fontWeight: "bold"
				}
			});
			
			loadingView.add(lbl);
		
			loadingView.add(act);
			act.show();
			
			loadingView.visible = false;
			win.add(loadingView);
		}
		
		loadingView.children[0].text = opts.message || "Loading...";
				
		loadingView.visible = true;
	};
	
	var hideLoadingView = function (opts) {
		loadingView.visible = false;
		loadingView = false;
	};

	return {
		extend: function (obj) {
			for (var i = 1; i < arguments.length; i++) {
				for (var prop in arguments[i]) {
					if (arguments[i].hasOwnProperty(prop)) {
						obj[prop] = arguments[i][prop];
					}
				}
			}
			
			return obj;
		},
		createProductTableViewRow: function (product, hasPurchased) {		
			var row = Ti.UI.createTableViewRow({
				hasChild: !hasPurchased ? true : false,
				hasCheck: hasPurchased ? true : false,
				height: 60
			});
			
			var title = Ti.UI.createLabel({
				top: 5,
				left: 10,
				height: 30,
				text: product.title,
				color: "#000",
				font: {
					fontSize: 20,
					fontWeight: "bold"
				}
			});
			
			row.add(title);
			
			var cost = Ti.UI.createLabel({
				bottom: 5,
				left: 10,
				height: 25,
				text: product.price,
				color: "#222",
				font: {
					fontSize: 16
				}
			});
			
			row.add(cost);
			
			return row;
		},
		createProductDetailWindow: function (product, opts) {
			var o = Cashola.extend({
				uidebug: true
			}, opts || {});
			
			var newWin = Ti.UI.createWindow({
				title: product.title,
				backgroundColor: "#fff"
			});
			
			var container = Ti.UI.createScrollView({
				contentHeight: "auto",
				showVerticalScrollIndicator: true,
				backgroundColor: "#fff"
			});
			
			var icon = Ti.UI.createView({
				top: 10,
				left: 10,
				width: 70,
				height: 70,
				borderRadius: 10,
				backgroundColor: "#222"
			});
			
			container.add(icon);
			
			var title = Ti.UI.createLabel({
				top: 10,
				left: 90,
				height: "auto",
				text: product.title,
				font: {
					fontSize: 22,
					fontWeight: "bold"
				}
			});
			
			container.add(title);
			
			var buyButton = Ti.UI.createButton({
				top: 50,
				right: 10,
				height: 35,
				width: 100,
				title: product.price
			});
			
			buyButton.addEventListener("click", function (e) {
				showLoadingView(newWin, { message: "Purchasing..." });

				if (!o.uidebug) {
					Ti.API.buyProduct({
						identifier: product.identifier,
						win: function (e) {
							if (e.response.state == "PaymentTransactionStatePurchased") {
								o.win(e.response);
							} else if (e.response.state == "PaymentTransactionStateRestored") {
								o.win(e.response);
							}
							
							hideLoadingView();
						},
						fail: function (e) {
							hideLoadingView();
							Ti.UI.createAlertDialog({ title: "Purchase Failed", message: "Unable to make purchase, reason: "+e.error.message }).show();
							o.error({
								code: e.response.code,
								message: e.response.message,
								product: product
							});
						}
					});
				} else {
					hideLoadingView();
					// Fake purchase callback.
					o.win({
						state: "PaymentTransactionStatePurchased",
						identifier: "com.magicseaweed.pro",
						receipt: "kdshfljdsnoivbnoifdslkfjdlksf",
						transactionIdentifier: "dsfdsfds"
					});
				}
			});
			
			container.add(buyButton);
			
			var description = Ti.UI.createLabel({
				top: 90,
				left: 10,
				right: 10,
				height: "auto",
				text: product.description,
				color: "#222",
				font: {
					fontSize: 18
				}
			});
			
			container.add(description);
			
			newWin.add(container);
			
			return newWin;
		},
		hasPurchasedProduct: function (identifier, purchased) {
			purchased = purchased || [];
			
			for (var i = 0; i < purchased.length; i++) {
				if (purchased[i] === identifier) {
					return true;
				}
			}
			
			return false;
		},
		createRestoreWindow: function (products, opts) {
			var o = Cashola.extend({
				uidebug: true
			}, opts || {});
		
			var newWin = Ti.UI.createWindow({
				title: "Restore/Transfer Purchase",
				backgroundColor: "#fff"
			});
			
			var text = Ti.UI.createLabel({// restoreDetails
				top: 10,
				left: 10,
				right: 10,
				height: "auto",
				text: opts.restoreDetails || "You should write some stuff about restoring purchases here.",
				color: "#222",
				font: {
					fontSize: 18
				}
			});
			
			newWin.add(text);
			
			var restoreBtn = Cashola.createRestoreCompletedTransactionsButton(o);
			newWin.add(restoreBtn);
			
			setTimeout(function () {
				restoreBtn.top = text.top + text.height + 20;
			}, 100);

			return newWin;
		},
		createRestoreCompletedTransactionsButton: function (opts) {
			var o = Cashola.extend({
				uidebug: true,
				top: 20,
				left: 20,
				right: 20,
				width: 280,
				height: 34,
				title: "Restore Previous Purchases"
			}, opts || {});
			
			var restoreAll = Ti.UI.createButton(o); 
			
			restoreAll.addEventListener("click", function () {
				//alert("now restore everything...");
				if (!o.uidebug) {
					Ti.API.restoreTransactions({
						win: function (p) {
							Ti.API.debug("some stuff was restored?");
						}
					});
				} else {
					Ti.API.debug("some stuff was restored?");
				}
			});
			
			return restoreAll;
		},
		createStoreWindow: function (opts) {
			return Ti.UI.createWindow({
				title: "Store"
			});
		},
		createStoreTableView: function () {
			return Ti.UI.createTableView({
				data: [],
				style: Ti.UI.iPhone.TableViewStyle.GROUPED
			});
		},
		startCheckout: function (opts) {
			var o = Cashola.extend({
				// Should we use the cashola module or just fake the data so we can test the UI quicker.
				uidebug: true,
				
				// Products that can be purchased, accepts string or array.
				identifiers: "com.magicseaweed.pro",
				
				// Default function to render restore window, is passed products array.
				createRestoreWindow: Cashola.createRestoreWindow,
				
				// Default function to render product detail window, is passed the product.
				createProductDetailWindow: Cashola.createProductDetailWindow,
				
				// Array of already purchased product identifiers.
				purchased: [],
				
				// Callback when a product is purchased.
				win: function () { },
				
				// Callback when the checkout is closed.
				closed: function () { },
				
				// Callback when there is an error.
				error: function () { }
			}, opts || {});
		
			var products = false;
			
			var modal = Ti.UI.createWindow({
				navBarHidden: true
			});
			
			var storeWin = Cashola.createStoreWindow();
			
			var tableView = Cashola.createStoreTableView();
			
			storeWin.add(tableView);
			
			var gotProducts = function (e) {
				products = e.products;
				var data = [];
	
				data[0] = Ti.UI.createTableViewSection({
					headerTitle: "Products"
				});
	
				data[1] = Ti.UI.createTableViewSection({
					headerTitle: "Subscription Options"
				});
				
				data[1].add(Ti.UI.createTableViewRow({
					title: "Transfer/Restore Purchases",
					restore: true,
					hasChild: true
				}));
				
				for (var i = 0; i < e.products.length; i++) {
					data[0].add(Cashola.createProductTableViewRow(e.products[i], Cashola.hasPurchasedProduct(e.products[i].identifier, o.purchased)));
				}
				
				tableView.setData(data);
			};
			
			tableView.addEventListener("click", function (e) {
				if (e.rowData.restore === true) {					
					var newWin = o.createRestoreWindow(products, o);
					nav.open(newWin);
				} else {
					var newWin = o.createProductDetailWindow(products[e.index], o);
					nav.open(newWin);
				}
			});

			var done = Titanium.UI.createButton({
				systemButton:Titanium.UI.iPhone.SystemButton.DONE
			});
			
			storeWin.setRightNavButton(done);
			
			done.addEventListener("click", function (e) {
				modal.close();
				o.closed();
			});
		
			var nav = Ti.UI.iPhone.createNavigationGroup({
				window: storeWin
			});
			
			modal.add(nav);
			modal.open({
				modal: true
			});
			
			showLoadingView(storeWin, { message: "Retrieving..." });
			if (!o.uidebug) {
				Ti.API.getProducts({
					identifiers: "com.magicseaweed.pro",
					win: function (e) {						
						gotProducts(e);
						hideLoadingView();
						retrieved = true;
					},
					fail: function (e) {
						o.error({
							code: 101,
							message: "Invalid product ID's specified.",
							products: e.failed
						});
					}
				});
			} else {
				gotProducts({
					products: [{
						identifier: "com.myapp.test.the.ui",
						title: "Some stuff",
						description: "blah, blah, blah",
						price: "$1.99"
					}]
				});
				hideLoadingView();
			}
		}
	};
})();