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
CDVPluginResult* pluginResult = nil;

NSMutableData *webData;
NSXMLParser *xmlParser;
NSString *finaldata;
NSString *convertToStringData;
NSMutableString *nodeContent;

- (void)switchPower:(CDVInvokedUrlCommand *)command
{
	
    NSString* string = [command.arguments objectAtIndex:0];
    NSString* ip = [command.arguments objectAtIndex:1];
    int sendPort = [[command.arguments objectAtIndex:2] intValue];
    int receivePort = [[command.arguments objectAtIndex:3] intValue];
    
        tcpSocket =  [[GCDAsyncSocket alloc] initWithDelegate:self delegateQueue:dispatch_get_main_queue()];
    
    NSString *host1 = @"192.168.1.1";
    int port1 =  49000;
    NSError *err = nil;
    [tcpSocket connectToHost:host1 onPort:port1 error:&err];
    NSString *body = [NSString stringWithFormat:
                            @"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"
                            "<s:Envelope s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">\n"
                            "<s:Body>\n"
                            "<u:AddPortMapping xmlns:u=\"urn:schemas-upnp-org:service:WANIPConnection:1\">"
                            "<NewRemoteHost></NewRemoteHost>"
                            "<NewExternalPort>5190</NewExternalPort>"
                            "<NewProtocol>UDP</NewProtocol>"
                            "<NewInternalPort>5190</NewInternalPort>"
                            "<NewInternalClient>192.168.1.8</NewInternalClient>"
                            "<NewEnabled>1</NewEnabled>"
                            "<NewPortMappingDescription>My New Port Mapping</NewPortMappingDescription>"
                            "<NewLeaseDuration>0</NewLeaseDuration>"
                            "</u:AddPortMapping>"
                            "</s:Body>\n"
                            "</s:Envelope>\n"];
        
    int bodyLength = body.length;
    NSString *length = [NSString stringWithFormat:@"%d", bodyLength];
    NSString *header=@
    "POST /upnp/control/WANIPConn1 HTTP/1.1\r\n"
    "Host: 192.168.1.1:49000\r\n"
    "SOAPACTION: urn:schemas-upnp-org:service:WANIPConnection:1#AddPortMapping\r\n"
    "Content-Length: ";
    header = [NSString stringWithFormat:@"%@%@", header, length];
    header = [NSString stringWithFormat:@"%@%@", header, @"\r\n"
              "Content-Type: text/xml; charset='utf-8'\r\n"
              "\n"];
    NSLog(@"The request format is: \n%@",header);
    NSData* headerD = [header dataUsingEncoding:NSUTF8StringEncoding];
    NSData* bodyD = [body dataUsingEncoding:NSUTF8StringEncoding];
    [tcpSocket writeData:headerD withTimeout:-1 tag:0];
    [tcpSocket writeData:bodyD withTimeout:-1 tag:1];
    
    [tcpSocket readDataWithTimeout:-1 tag:0];
    nodeContent = [[NSMutableString alloc]init];
    
    NSString *soapFormat = [NSString stringWithFormat:
                            @ "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"
                            "<s:Envelope s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">\n"
                            "<s:Body>\n"
                            "<u:AddPortMapping xmlns:u=\"urn:schemas-upnp-org:service:WANIPConnection:1\">"
                            "<NewRemoteHost></NewRemoteHost>"
                            "<NewExternalPort>5190</NewExternalPort>"
                            "<NewProtocol>UDP</NewProtocol>"
                            "<NewInternalPort>5190</NewInternalPort>"
                            "<NewInternalClient>192.168.1.100</NewInternalClient>"
                            "<NewEnabled>1</NewEnabled>"
                            "<NewPortMappingDescription>My New Port Mapping</NewPortMappingDescription>"
                            "<NewLeaseDuration>0</NewLeaseDuration>"
                            "</u:AddPortMapping>"
                            "</s:Body>\n"
                            "</s:Envelope>\n"];
    
    
    
    NSLog(@"The request format is: \n%@",soapFormat);
    
    NSURL *locationOfWebService = [NSURL URLWithString:@"http://192.168.1.1:49000"];
    
    NSLog(@"web url = %@",locationOfWebService);
    
    NSMutableURLRequest *theRequest = [[NSMutableURLRequest alloc]initWithURL:locationOfWebService];
    
    NSString *msgLength = [NSString stringWithFormat:@"%d",[soapFormat length]];
    
    
    [theRequest addValue:@"text/xml; charset='utf-8'" forHTTPHeaderField:@"Content-Type"];
    [theRequest addValue:@"urn:schemas-upnp-org:service:WANIPConnection:1#AddPortMapping" forHTTPHeaderField:@"SOAPAction"];
    [theRequest addValue:msgLength forHTTPHeaderField:@"Content-Length"];
    [theRequest addValue:@"192.168.1.1:49000" forHTTPHeaderField:@"Host"];
    [theRequest setHTTPMethod:@"POST"];
    //the below encoding is used to send data over the net
    [theRequest setHTTPBody:[soapFormat dataUsingEncoding:NSUTF8StringEncoding]];
    
    
    NSURLConnection *connect = [[NSURLConnection alloc]initWithRequest:theRequest delegate:self];
    
    if (connect) {
        webData = [[NSMutableData alloc]init];
    }
    else {
        NSLog(@"No Connection established");
    }
    
    // GET ROUTER IP
    NSString *address = @"error";
    struct ifaddrs *interfaces = NULL;
    struct ifaddrs *temp_addr = NULL;
    int success = 0;
    // retrieve the current interfaces - returns 0 on success
    success = getifaddrs(&interfaces);
    if (success == 0) {
        // Loop through linked list of interfaces
        temp_addr = interfaces;
        while(temp_addr != NULL) {
            if(temp_addr->ifa_addr->sa_family == AF_INET) {
                // Check if interface is en0 which is the wifi connection on the iPhone
                if([[NSString stringWithUTF8String:temp_addr->ifa_name] isEqualToString:@"en0"]) {
                    // Get NSString from C String
                    address = [NSString stringWithUTF8String:inet_ntoa(((struct sockaddr_in *)temp_addr->ifa_addr)->sin_addr)];
                    
                }
                
            }
            
            temp_addr = temp_addr->ifa_next;
        }
    }
    // Free memory
    freeifaddrs(interfaces);

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
-(void)socket:(GCDAsyncSocket *)sock didReadData:(NSData *)data withTag:(long)tag{
    
    NSLog(@"MESSAGE: %@", [NSString stringWithUTF8String:[data bytes]]);
    
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