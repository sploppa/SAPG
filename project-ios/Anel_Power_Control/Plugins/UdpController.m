/********* Echo.m Cordova Plugin Implementation *******/

#import "UdpController.h"
#import "GCDAsyncSocket.h"
#import "GCDAsyncUdpSocket.h"
#import <Cordova/CDV.h>
#include <ifaddrs.h>
#include <arpa/inet.h>

@implementation UdpController

@synthesize com_private_condition;
@synthesize com_private_theWaitingThread;

NSString *result=nil;
GCDAsyncUdpSocket *udpSocket;
GCDAsyncSocket *tcpSocket;
CDVPluginResult* pluginResult_Udp = nil;

NSMutableData *webData;
NSXMLParser *xmlParser;
NSString *finaldata;
NSString *convertToStringData;
NSMutableString *nodeContent;

- (void)sendBroadcastMessage:(CDVInvokedUrlCommand *)command
{
	
    NSString* message = [command.arguments objectAtIndex:0];
    NSString* ip = [command.arguments objectAtIndex:1];
    int port = [[command.arguments objectAtIndex:2] intValue];
    
    NSData* messageD = [message dataUsingEncoding:NSUTF8StringEncoding];
    
    udpSocket = [[GCDAsyncUdpSocket alloc] initWithDelegate:self delegateQueue:dispatch_get_main_queue()];
    
    NSError *error = nil;
    
    if (![udpSocket bindToPort:port error:&error])
    {
        NSLog(@"Error binding: %@", [error description]);
        return;
    }
    if (![udpSocket beginReceiving:&error])
    {
        NSLog(@"Error receiving: %@", [error description]);
        return;
    }
    
    [udpSocket enableBroadcast:YES error:&error];
    if (error != nil)
    {
        NSLog(@"Error enableing broadcast: %@", [error description]);
        return;
    }
    
    NSLog(@"Socket Created");
    
  
    [udpSocket sendData:messageD toHost:ip port:port withTimeout:-1 tag:0];
  
    [self waitForConditionWithTimeout:2.0];
    NSLog(@"Sent Data");
    NSLog(result);
    
    if (result != nil && [result length] > 0) {
        pluginResult_Udp = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:result];
    } else {
        pluginResult_Udp = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult_Udp callbackId:command.callbackId];
    
    [udpSocket close];
  }

- (void)udpSocket:(GCDAsyncUdpSocket *)sock didReceiveData:(NSData *)data
      fromAddress:(NSData *)address withFilterContext:(id)filterContext
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

-(void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response
{
    [webData setLength: 0];
}
-(void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data
{
    [webData appendData:data];
}
-(void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error
{
    NSLog(@"ERROR with theConenction");
    [connection release];
    [webData release];
}

-(BOOL)connection:(NSURLConnection *)connection canAuthenticateAgainstProtectionSpace:(NSURLProtectionSpace *)protectionSpace
{
    return YES;
}

-(void)connection:(NSURLConnection *)connection didReceiveAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge
{
    NSURLCredential *credential = [NSURLCredential credentialWithUser:@"username" password:@"password" persistence:NSURLCredentialPersistenceForSession];
    [[challenge sender] useCredential:credential forAuthenticationChallenge:challenge];
}


-(void)connectionDidFinishLoading:(NSURLConnection *)connection
{
    NSLog(@"DONE. Received Bytes: %d \n", [webData length]);
    NSString *theXML = [[NSString alloc] initWithBytes: [webData mutableBytes] length:[webData length] encoding:NSUTF8StringEncoding];
    NSLog(@"\n%@",theXML);
    [connection release];
}
@end