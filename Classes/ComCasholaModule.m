/**
 * Your Copyright Here
 *
 * Appcelerator Titanium is Copyright (c) 2009-2010 by Appcelerator, Inc.
 * and licensed under the Apache Public License (version 2)
 */
#import "ComCasholaModule.h"
#import "TiBase.h"
#import "TiHost.h"
#import "TiUtils.h"
#import "SKProduct+LocalizedPrice.h"

// Private
@interface ComCasholaModule()
-(void)prepCallbacks:(id)args;
@end

@implementation ComCasholaModule

#pragma mark Internal

// this is generated for your module, please do not change it
-(id)moduleGUID
{
	return @"05bfcd62-0c1c-4c57-81c7-f72a6d125ced";
}

// this is generated for your module, please do not change it
-(NSString*)moduleId
{
	return @"com.cashola";
}

#pragma mark Lifecycle

-(void)startup
{
	// this method is called when the module is first loaded
	// you *must* call the superclass
	[super startup];
	
	NSLog(@"[INFO] %@ loaded",self);
}

-(void)shutdown:(id)sender
{
	// this method is called when the module is being unloaded
	// typically this is during shutdown. make sure you don't do too
	// much processing here or the app will be quit forceably
	
	// you *must* call the superclass
	[super shutdown:sender];
}

#pragma mark Cleanup 

-(void)dealloc
{
	// release any resources that have been retained by the module
	[super dealloc];
}

#pragma mark Internal Memory Management

-(void)didReceiveMemoryWarning:(NSNotification*)notification
{
	// optionally release any resources that can be dynamically
	// reloaded once memory is available - such as caches
	[super didReceiveMemoryWarning:notification];
}

#pragma mark Listener Notifications

-(void)_listenerAdded:(NSString *)type count:(int)count
{
	if (count == 1 && [type isEqualToString:@"my_event"])
	{
		// the first (of potentially many) listener is being added 
		// for event named 'my_event'
	}
}

-(void)_listenerRemoved:(NSString *)type count:(int)count
{
	if (count == 0 && [type isEqualToString:@"my_event"])
	{
		// the last listener called for event named 'my_event' has
		// been removed, we can optionally clean up any resources
		// since no body is listening at this point for that event
	}
}

-(void)prepCallbacks:(id)args
{
	ENSURE_UI_THREAD_1_ARG(args);
	ENSURE_SINGLE_ARG(args, NSDictionary);
	
	// Store the callbacks for later.
	id win		= [args objectForKey:@"win"];
	id fail		= [args objectForKey:@"fail"];
	id error	= [args objectForKey:@"error"];
	
	// Make sure the instance callbacks are nil.
	RELEASE_TO_NIL(winCallback);
	RELEASE_TO_NIL(failCallback);
	RELEASE_TO_NIL(errorCallback);
	
	// Put the callbacks from the passed JS object into instance vars.
	if (win != nil) 
	{
		ENSURE_TYPE(win, KrollCallback); // Verifies type.
		winCallback = win;
	}	
	if (fail != nil)
	{
		ENSURE_TYPE(fail, KrollCallback); // Verifies type.
		failCallback = fail;
	}
	if (error != nil)
	{
		ENSURE_TYPE(error, KrollCallback); // Verifies type.
		errorCallback = error;
	}
}

#pragma Public APIs

-(void)getProducts:(id)args
{
	[self prepCallbacks:args];

	NSSet *productIds = nil;
	id ids = [args objectForKey:@"identifiers"];
	if ([ids isKindOfClass:[NSString class]])
	{ // Single ID.
		productIds = [NSSet setWithObject:ids];					  
	}
	else if ([ids isKindOfClass:[NSArray class]])
	{
		productIds = [NSSet setWithArray:ids];
	}
	else 
	{
		[self throwException:TiExceptionInvalidType subreason:[NSString stringWithFormat:@"Cashola.getProducts.identifiers must be passed: Array or String, was: %@", [ids class]] location:CODELOCATION];
	}
	
	SKProductsRequest *req = [[[SKProductsRequest alloc] initWithProductIdentifiers:productIds] autorelease];
	req.delegate = self;
	[req start];
}

-(void)makePurchase:(id)args
{
	[self prepCallbacks:args];
	
	SKMutablePayment *payment = [SKMutablePayment paymentWithProductIdentifier:[args objectForKey:@"identifier"]];
	
	id quantity = [args objectForKey:@"quantity"];
	if ([quantity isKindOfClass:[NSNumber class]]) {
		payment.quantity = [quantity integerValue];
	}
	
	[[SKPaymentQueue defaultQueue] addPayment:payment];
}

#pragma mark Delegates

- (void)paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transactions
{	
	for (SKPaymentTransaction *transaction in transactions) {
		NSMutableDictionary *response = [[[NSMutableDictionary alloc] init] autorelease];
		
		switch (transaction.transactionState) {
			case SKPaymentTransactionStatePurchased:
				[response setObject:@"PaymentTransactionStatePurchased" forKey:@"state"];
				[response setObject:transaction.transactionIdentifier forKey:@"transactionIdentifier"];
				[response setObject:[[transaction transactionReceipt] base64EncodedString] forKey:@"receipt"];
				[response setObject:transaction.payment.productIdentifier forKey:@"identifier"];
				
				if (winCallback)
				{
					NSDictionary *event = [NSDictionary dictionaryWithObjectsAndKeys:response, @"response", nil];
					[self _fireEventToListener:@"win" withObject:event listener:winCallback thisObject:nil];
				}
				
				break;
			case SKPaymentTransactionStateFailed:
				[response setObject:@"PaymentTransactionStateFailed" forKey:@"state"];
				[response setObject:transaction.error.localizedDescription forKey:@"error"];
				[response setObject:[NSNumber numberWithInteger:transaction.error.code] forKey:@"code"];
				
				if (failCallback)
				{
					NSDictionary *event = [NSDictionary dictionaryWithObjectsAndKeys:response, @"error", nil];
					[self _fireEventToListener:@"win" withObject:event listener:failCallback thisObject:nil];
				}
				
				break;
			case SKPaymentTransactionStateRestored:
				[response setObject:@"SKPaymentTransactionStateRestored" forKey:@"state"];
				[response setObject:transaction.originalTransaction.transactionIdentifier forKey:@"identifier"];
				[response setObject:[[[transaction originalTransaction] transactionReceipt] base64EncodedString] forKey:@"receipt"];
				[response setObject:transaction.originalTransaction.payment.productIdentifier forKey:@"identifier"];
				
				if (winCallback)
				{
					NSDictionary *event = [NSDictionary dictionaryWithObjectsAndKeys:response, @"response", nil];
					[self _fireEventToListener:@"win" withObject:event listener:winCallback thisObject:nil];
				}
				
				break;

			default:
				break;
		}
		
		[[SKPaymentQueue defaultQueue] finishTransaction:transaction];
	}
}

- (void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response
{
	if (winCallback)
	{
		NSMutableArray* products = [NSMutableArray array];
		for (SKProduct* product in response.products) {
			[products addObject:[NSDictionary dictionaryWithObjectsAndKeys:product.productIdentifier, @"identifier", product.localizedTitle, @"title", product.localizedDescription, @"description", [product localizedPrice], @"price"]];
		}
		NSDictionary *event = [NSDictionary dictionaryWithObjectsAndKeys:products, @"products", nil];
		[self _fireEventToListener:@"win" withObject:event listener:winCallback thisObject:nil];
	}
	
	if (failCallback)
	{
		NSMutableArray* failed = [NSMutableArray array];
		for (NSString *invalidProductId in response.invalidProductIdentifiers) {
			[failed addObject:invalidProductId];
		}
		NSDictionary *event = [NSDictionary dictionaryWithObjectsAndKeys:failed, @"failed", nil];
		[self _fireEventToListener:@"fail" withObject:event listener:failCallback thisObject:nil];
	}
}

@end
