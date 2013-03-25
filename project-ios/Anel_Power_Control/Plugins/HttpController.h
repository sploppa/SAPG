//
//  HttpController.h
//  Anel_Power_Control
//
//  Created by Baskus Marti on 24.03.13.
//
//
#import <Cordova/CDV.h>

@interface HttpController : CDVPlugin

@property (nonatomic, assign) BOOL com_private_condition;
@property (nonatomic, assign) NSThread* com_private_theWaitingThread;


- (void)sendMessage:(CDVInvokedUrlCommand*)command;
@end
