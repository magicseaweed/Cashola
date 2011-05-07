/**
 * Your Copyright Here
 *
 * Appcelerator Titanium is Copyright (c) 2009-2010 by Appcelerator, Inc.
 * and licensed under the Apache Public License (version 2)
 */
#import "TiModule.h"
#import <StoreKit/StoreKit.h>

#import "SKProduct+LocalizedPrice.h"

@interface ComCasholaModule : TiModule <SKProductsRequestDelegate>
{
	KrollCallback *winCallback;
	KrollCallback *failCallback;
	KrollCallback *errorCallback;
}

@end
