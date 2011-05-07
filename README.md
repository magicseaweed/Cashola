# Cashola #

#### Still in dev. ####

Open source and free In-App Purchase module for Titanium. Works on iOS at the moment.

## Installation ##

1. Open the Terminal
2. Run
	python build.py && unzip com.cashola-iphone-0.1.zip -d /Library/Application\ Support/Titanium/

3. Register the module in your app, by opening your app's `tiapi.xml` and adding the below element to `<modules>`
	<module version="0.1">com.cashola</module>

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
			Ti.API.debug(e.purchase.receipt);
		}
	});

All functions support `win`, `fail` and `error` callbacks. 

* `Win` is pretty self explanitory.
* `fail` the user made it not work. They might have canceled the payment.
* `error` something went wrong.

## Beyond just a Module ##

Cashola is one step more awesome than a module. It comes with a JS library, which you can optional include wrapping up the method implemented natively to provide a complete checkout flow.

Cashola's checkout experience works simliar to PayPal Express.

	Cashola.startCheckout({
		identifiers: ["com.mycompany.productOne", "com.mycompany.productTwo"],
		win: function (e) {
			alert("You purchased: "+e.purchase.title);
		},
		fail: function (e) { // User quit.
			alert("Nothing purchased.");
		},
		error: function (e) { // Programming error etc.
			alert("Some failure.");
		}
	});
	
The UI to view your store and purchase a product is sorted out for you by Cashola. `win` is called each time a product is purchased.

## Tests ##

Find out how to test in Objective-C.
Find out a decent way of testing in Titanium.

## In The Works ##
Android Support (via PayPal)
Blackberry? (maybe via PayPal SDK or using a browser and PayPal express checkout)

## Contribute ##

Fork it on GitHub. Add awesome. Send pull request. Recieve high 5.

## License ##

Copyright Gavin Cooper

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.