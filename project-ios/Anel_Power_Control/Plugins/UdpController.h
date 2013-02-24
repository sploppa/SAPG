/********* Echo.h Cordova Plugin Header *******/

#import <Cordova/CDV.h>

@interface UdpController : CDVPlugin

@property (nonatomic, assign) BOOL com_private_condition;
@property (nonatomic, assign) NSThread* com_private_theWaitingThread;

- (void)switchPower:(CDVInvokedUrlCommand*)command;

@end