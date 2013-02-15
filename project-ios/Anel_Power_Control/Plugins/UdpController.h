/********* Echo.h Cordova Plugin Header *******/

#import <Cordova/CDV.h>

@interface UdpController : CDVPlugin

- (void)switchPower:(CDVInvokedUrlCommand*)command;

@end