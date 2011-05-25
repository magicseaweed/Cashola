# IMPORTANT #

This is a container development app.

Bascially you need to run the StoreKit code on a device with the correct app id in order to test the library classes.

## How To Dev & Test ##

1. Import project into Appcelerator.
2. Use your own app ID.
3. Use Appcelerator to build this project.
4. Go to build/iphone and open the *.xcodeproj file.
5. In XCode copy the methods and instance variable from ComCasholaModule.h and ComCasholaModule.m into Project/Classes/Modules/APIModule*
6. Now this app.js can use Cashola as Ti.API.getProducts() etc.
7. Build & Run

If there is an easier way please let me know, because this sucks.
