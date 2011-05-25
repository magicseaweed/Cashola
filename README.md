# Cashola #

### THIS IS IN NO WAY PRODUCTION READY ###

#### Still in dev. ####

Open source and free In-App Purchase module for Titanium. Works on iOS at the moment.

## Installation ##

1. Open the Terminal

2. Run
`python build.py && unzip com.cashola-iphone-0.1.zip -d /Library/Application\ Support/Titanium/`

3. If the last line of the output for the above command was `ImportError: No module named markdown` Then you either need to install the python markdown module or just run below, to finish off the install.
`unzip com.cashola-iphone-0.1.zip -d /Library/Application\ Support/Titanium/`

3. Register the module in your app, by opening your app's `tiapi.xml` and adding the below element to `<modules>`
`<module version="0.1">com.cashola</module>`

## Using the API ##

You can use Cashola at a low level and provide your own custom UI.

	var cashola = require("cashola");
	cashola.getProducts({
		identifiers: ["com.mycompany.productOne", "com.mycompany.productTwo"],
		win: function (e) {
			for (var i = 0; i < e.products.length; i++) {
				Ti.API.debug(e.products[i].title); // Array
			}
		}
	});
	
	cashola.buyProduct({
		identifier: "com.mycompany.productOne",
		win: function (e) {
			Ti.API.debug(e.response.receipt);
		}
	});

All functions support `win`, `fail` and `error` callbacks (except startCheckout).

* `Win` is pretty self explanitory.
* `fail` the user made it not work. They might have canceled the payment.
* `error` something went wrong.

## Beyond just a Module ##

Cashola is one step more awesome than a module. It comes with a JS library, which you can optional include wrapping up the method implemented natively to provide a complete checkout flow.

Cashola's checkout experience works simliar to PayPal Express.

	Cashola.startCheckout({
		identifiers: ["com.mycompany.productOne", "com.mycompany.productTwo"],
		win: function (e) { // Called on each purchase.
			alert("You purchased: "+e.response.identifier);
		},
		closed: function (e) { // User quit.
			alert("Nothing purchased.");
		},
		error: function (e) { // Programming error etc.
			alert("Some failure.");
		}
	});
	
The UI to view your store and purchase a product is sorted out for you by Cashola. `win` is called each time a product is purchased.

## WTF? It's not working? ##

#### 1. I don't get a response from Cashola.getProducts(), explain? ####
Have you checked you are passing it the correct product identifiers? No response is given by Apple's StoreKit if you pass it something invalid, it will just "not work". If you are passing it the correct product indentifier(s), how recently did you add those products? If it was within the last 24 hours then it's a good idea to leave it for a day and come back to it, sometimes StoreKit takes a will to respond to new products. Failing all that [checkout this list of common problems](http://developer.apple.com/library/ios/#technotes/tn2259/_index.html), from the good folks at el'Apple.
You can checkout [this great post](http://troybrant.net/blog/2010/01/invalid-product-ids/) if your still getting invalid product ID's.

#### 2. It won't work in the simulator? ####
StoreKit does not work in the simulator, you must use a device to test it. Open up the underlying XCode project created by Titanium, select your connected iPhone from the left and hit "Build & Run".

## Tests ##

Find out how to test in Objective-C.
Find out a decent way of testing in Titanium.

## In The Works ##
Android Support (via PayPal)
Blackberry? (maybe via PayPal SDK or using a browser and PayPal express checkout)

## Contribute ##

Fork it on GitHub. Add awesome. Send pull request. Recieve high 5.

## License ##

Copyright Metcentral Ltd 2011

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.