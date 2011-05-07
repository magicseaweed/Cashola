//
//  SKProduct+LocalizedPrice.m
//  cashola
//
//  Created by GC on 07/05/2011.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "SKProduct+LocalizedPrice.h"


@implementation SKProduct_LocalizedPrice

- (NSString *)localizedPrice
{
    NSNumberFormatter *numberFormatter = [[NSNumberFormatter alloc] init];
    [numberFormatter setFormatterBehavior:NSNumberFormatterBehavior10_4];
    [numberFormatter setNumberStyle:NSNumberFormatterCurrencyStyle];
    [numberFormatter setLocale:self.priceLocale];
    NSString *formattedString = [numberFormatter stringFromNumber:self.price];
    [numberFormatter release];
    return formattedString;
}

@end
