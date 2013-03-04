/********* Echo.m Cordova Plugin Implementation *******/

#import "UdpController.h"
#import "GCDAsyncUdpSocket.h"
#import <Cordova/CDV.h>

@implementation UdpController

@synthesize com_private_condition;
@synthesize com_private_theWaitingThread;

NSString *result=nil;
GCDAsyncUdpSocket *udpSocket;
CDVPluginResult* pluginResult = nil;

- (void)switchPower:(CDVInvokedUrlCommand *)command
{
	
    NSString* string = [command.arguments objectAtIndex:0];
    NSString* ip = [command.arguments objectAtIndex:1];
    int sendPort = [[command.arguments objectAtIndex:2] intValue];
    int receivePort = [[command.arguments objectAtIndex:3] intValue];
    
     udpSocket = [[GCDAsyncUdpSocket alloc] initWithDelegate:self delegateQueue:dispatch_get_main_queue()];
    
    NSString *host = ip;
    int port =  sendPort;
    [udpSocket connectToHost:host onPort:port error:nil];
    
    NSData* data = [string dataUsingEncoding:NSUTF8StringEncoding];
    
    int tag = 1;
    [udpSocket sendData:data withTimeout:-1 tag:tag];

    NSError *error = nil;
     udpSocket = [[GCDAsyncUdpSocket alloc] initWithDelegate:self delegateQueue:dispatch_get_main_queue()];
    [udpSocket bindToPort:1027 error:&error];
    if(error != nil)
    {
        NSString * message = [NSString stringWithFormat: @"Something horrible went wrong: %@", [error userInfo]];
        
        NSLog(@"%@", message);
    }
    [udpSocket receiveOnce:&error];
    [self waitForConditionWithTimeout:10.0];
    
        if (result != nil && [result length] > 0) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:result];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        }
        
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    [udpSocket close];
}

- (void)udpSocket:(GCDAsyncUdpSocket *)sock didReceiveData:(NSData *)data
      fromAddress:(NSData *)address
withFilterContext:(id)filterContext
{
    NSLog(@"niets.");
    NSString *msg = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    if (msg)
    {
        NSLog(@"iets gekregen");
    }
    else
    {
        NSLog(@"Error convertion");
        //[self logError:@"Error converting received data into UTF-8 String"];
    }
    //NSString *test = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    //NSLog(@"%@",test);
    //[udpSocket sendData:data toAddress:address withTimeout:-1 tag:0];
    NSLog(@"HMMMM");
    result = [[NSString alloc] initWithFormat:@"%@", msg];
    [self signalCondition];
}
- (BOOL)waitForConditionWithTimeout:(NSTimeInterval)aTimeout
{
    self.com_private_condition = NO;
    self.com_private_theWaitingThread = [NSThread currentThread];
    NSDate* theStartDate = [NSDate date];
    NSDate* theEndDate = [NSDate dateWithTimeIntervalSinceNow:aTimeout];
    do
    {
        [[NSRunLoop currentRunLoop] runMode:NSDefaultRunLoopMode
                                 beforeDate:theEndDate];
        NSTimeInterval theElapsedTime = -[theStartDate timeIntervalSinceNow];
        if (theElapsedTime >= aTimeout)
        {
            return NO;
        }
        if (self.com_private_condition)
        {
            return YES;
        }
    } while (YES);
}

- (void)signalCondition
{
    [self performSelector:@selector(com_private_signalCondition:)
                 onThread:self.com_private_theWaitingThread
               withObject:nil waitUntilDone:NO];
}

- (void)com_private_signalCondition:(id)aParam
{
    self.com_private_condition = YES; 
}
@end