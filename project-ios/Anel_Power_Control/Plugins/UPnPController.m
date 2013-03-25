/********* Echo.m Cordova Plugin Implementation *******/

#import "UPnPController.h"
#import "GCDAsyncSocket.h"
#import "GCDAsyncUdpSocket.h"
#import "XMLReader.h"
#import <Cordova/CDV.h>

@implementation UPnPController

@synthesize com_private_condition;
@synthesize com_private_theWaitingThread;

GCDAsyncSocket *tcpSocket;

NSString *respond;
NSString *ROUTER_IP;
int ROUTER_PORT;
NSString *DELIVERY_PATH;
NSString *result_UPnP;
CDVPluginResult* pluginResult_UPnP = nil;

- (void)getRouterInfo:(CDVInvokedUrlCommand *)command
{
	
    NSString* DISCOVER_MESSAGE_ROOTDEVICE = [command.arguments objectAtIndex:0];
    NSString* MULTICAST_ADDRESS = [command.arguments objectAtIndex:1];
    int MULTICAST_PORT = [[command.arguments objectAtIndex:2] intValue];
    
    tcpSocket =  [[GCDAsyncSocket alloc] initWithDelegate:self delegateQueue:dispatch_get_main_queue()];
 
    NSError *err = nil;
    [tcpSocket connectToHost:MULTICAST_ADDRESS onPort:MULTICAST_PORT error:&err];
    
    NSLog(@"The request format is: \n%@",DISCOVER_MESSAGE_ROOTDEVICE);
    NSData* headerD = [DISCOVER_MESSAGE_ROOTDEVICE dataUsingEncoding:NSUTF8StringEncoding];
    [tcpSocket writeData:headerD withTimeout:-1 tag:0];
    
    
    [tcpSocket readDataWithTimeout:-1 tag:0];
    
    GCDAsyncUdpSocket *udpSocket = [[GCDAsyncUdpSocket alloc] initWithDelegate:self delegateQueue:dispatch_get_main_queue()];
    
    NSError *error = nil;
    
    if (![udpSocket bindToPort:0 error:&error])
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
    
    [udpSocket sendData:headerD toHost:MULTICAST_ADDRESS port:MULTICAST_PORT withTimeout:-1 tag:0];
    
    NSLog(@"Sent Data");
    
    [self waitForConditionWithTimeout:1.0];
    
    NSLog(respond);
    error = NULL;
    NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:@"HTTP/1.1 200 OK" options:NSRegularExpressionCaseInsensitive error:&error];
    
    NSUInteger numberOfMatches = [regex numberOfMatchesInString:respond options:0 range:NSMakeRange(0, [respond length])];
    if (numberOfMatches > 0) {
        regex = [NSRegularExpression regularExpressionWithPattern:@"LOCATION: .*" options:NSRegularExpressionCaseInsensitive error:&error];
        
        NSRange rangeOfFirstMatch = [regex rangeOfFirstMatchInString:respond options:0 range:NSMakeRange(0, [respond length])];
        if (!NSEqualRanges(rangeOfFirstMatch, NSMakeRange(NSNotFound, 0))) {
            NSString *substringForFirstMatch = [respond substringWithRange:rangeOfFirstMatch];
            regex = [NSRegularExpression regularExpressionWithPattern:@"LOCATION: " options:NSRegularExpressionCaseInsensitive error:&error];
            NSString *url = [regex stringByReplacingMatchesInString:substringForFirstMatch options:0 range:NSMakeRange(0, [substringForFirstMatch length]) withTemplate:@""];
            NSLog(@"%@", url);
            
            regex = [NSRegularExpression regularExpressionWithPattern:@"\\d+[.]\\d+[.]\\d+[.]\\d+" options:NSRegularExpressionCaseInsensitive error:&error];
            
            NSRange rangeOfFirstMatch = [regex rangeOfFirstMatchInString:url options:0 range:NSMakeRange(0, [url length])];
            if (!NSEqualRanges(rangeOfFirstMatch, NSMakeRange(NSNotFound, 0))) {
                ROUTER_IP = [url substringWithRange:rangeOfFirstMatch];
                regex = [NSRegularExpression regularExpressionWithPattern:@":\\d+" options:NSRegularExpressionCaseInsensitive error:&error];
                NSRange rangeOfFirstMatch = [regex rangeOfFirstMatchInString:url options:0 range:NSMakeRange(0, [url length])];
                if (!NSEqualRanges(rangeOfFirstMatch, NSMakeRange(NSNotFound, 0))) {
                    substringForFirstMatch = [url substringWithRange:rangeOfFirstMatch];
                    ROUTER_PORT = [[substringForFirstMatch substringWithRange:NSMakeRange(1, [substringForFirstMatch length]-1)] intValue];
                    
                    NSString *xmlDescriptor = [self getDataFrom:url];
                    NSLog(xmlDescriptor);
                    
                    regex = [NSRegularExpression regularExpressionWithPattern:@"<serviceList>([(\\n)](.*))*</serviceList>" options:NSRegularExpressionCaseInsensitive error:&error];
                    NSRange rangeOfFirstMatch = [regex rangeOfFirstMatchInString:xmlDescriptor options:0 range:NSMakeRange(0, [xmlDescriptor length])];
                    if (!NSEqualRanges(rangeOfFirstMatch, NSMakeRange(NSNotFound, 0))) {
                        substringForFirstMatch = [xmlDescriptor substringWithRange:rangeOfFirstMatch];
                        NSLog(substringForFirstMatch);
                        regex = [NSRegularExpression regularExpressionWithPattern:@"(<service>([(\\n)](.*?))*?</service>)" options:NSRegularExpressionCaseInsensitive error:&error];
                        NSArray *matches = [regex matchesInString:substringForFirstMatch options:0 range:NSMakeRange(0, [substringForFirstMatch length])];
                        for (NSTextCheckingResult *match in matches) {
                            NSRange matchRange = [match range];
                            NSRange range = [match range];
                            NSRange secondHalfRange = [match rangeAtIndex:2];
                        
                            NSString *substringForMatch = [substringForFirstMatch substringWithRange:range];
                            NSLog(substringForMatch);
                            
                            
                            regex = [NSRegularExpression regularExpressionWithPattern:@"urn:schemas-upnp-org:service:WANIPConnection:1" options:NSRegularExpressionCaseInsensitive error:&error];
                            NSRange rangeOfFirstMatch = [regex rangeOfFirstMatchInString:substringForMatch options:0 range:NSMakeRange(0, [substringForMatch length])];
                            if (!NSEqualRanges(rangeOfFirstMatch, NSMakeRange(NSNotFound, 0))) {
                                regex = [NSRegularExpression regularExpressionWithPattern:@"<controlURL>.*?</controlURL>" options:NSRegularExpressionCaseInsensitive error:&error];
                                NSRange rangeOfFirstMatch = [regex rangeOfFirstMatchInString:substringForMatch options:NSRegularExpressionCaseInsensitive range:NSMakeRange(0, [substringForMatch length])];
                                if (!NSEqualRanges(rangeOfFirstMatch, NSMakeRange(NSNotFound, 0))) {
                                    NSString *controlURL = [substringForMatch substringWithRange:rangeOfFirstMatch];
                                    DELIVERY_PATH = [controlURL substringWithRange:NSMakeRange(12, [controlURL length]-25)];
                                    NSLog(DELIVERY_PATH);
                                    result_UPnP = [NSString stringWithFormat:@"%@:%@:%d", DELIVERY_PATH, ROUTER_IP, ROUTER_PORT];
                                }
                            }
                        }
                    }   
                }
            }
        }
    }
    
    if (result_UPnP != nil && [result_UPnP length] > 0) {
        pluginResult_UPnP = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:result_UPnP];
    } else {
        pluginResult_UPnP = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult_UPnP callbackId:command.callbackId];
    [udpSocket close];
    [tcpSocket disconnect];

 
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
- (void)udpSocket:(GCDAsyncUdpSocket *)sock didReceiveData:(NSData *)data
      fromAddress:(NSData *)address
withFilterContext:(id)filterContext
{
    NSLog(@"Did Receive Data");
    NSString *msg = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    if (msg)
    {
        NSLog(@"Message: %@",msg);
        respond = msg;
    }
    else
    {
        NSString *host = nil;
        uint16_t port = 0;
        [GCDAsyncUdpSocket getHost:&host port:&port fromAddress:address];
        
        NSLog(@"Unknown Message: %@:%hu", host, port);
    }
}
- (NSString *) getDataFrom:(NSString *)url{
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    [request setHTTPMethod:@"GET"];
    [request setURL:[NSURL URLWithString:url]];
    
    NSError *error = [[NSError alloc] init];
    NSHTTPURLResponse *responseCode = nil;
    
    NSData *oResponseData = [NSURLConnection sendSynchronousRequest:request returningResponse:&responseCode error:&error];
    
    if([responseCode statusCode] != 200){
        NSLog(@"Error getting %@, HTTP status code %i", url, [responseCode statusCode]);
        return nil;
    }
    
    return [[NSString alloc] initWithData:oResponseData encoding:NSUTF8StringEncoding];
}
@end