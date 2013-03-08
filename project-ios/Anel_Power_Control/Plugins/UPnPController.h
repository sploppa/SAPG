//
//  UPnPController.h
//  Anel_Power_Control
//
//  Created by Baskus Marti on 08.03.13.
//
//

#import <Cordova/CDV.h>

@interface UPnPController : CDVPlugin

- (void)addPortMapping:(CDVInvokedUrlCommand*)command;

@end