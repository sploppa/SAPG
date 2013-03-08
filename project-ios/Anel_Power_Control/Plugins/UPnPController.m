/********* Echo.m Cordova Plugin Implementation *******/

#import "UPnPController.h"
#import "GCDAsyncSocket.h"
#import <Cordova/CDV.h>

@implementation UPnPController

NSString *result2=nil;
GCDAsyncSocket *tcpSocket;
CDVPluginResult* pluginResult2 = nil;

NSMutableData *webData;
NSXMLParser *xmlParser;
NSString *finaldata;
NSString *convertToStringData;
NSMutableString *nodeContent;

- (void)addPortMapping:(CDVInvokedUrlCommand *)command
{
	
    NSString* ip = [command.arguments objectAtIndex:0];
    int receivePort = [[command.arguments objectAtIndex:1] intValue];
    int sendPort = [[command.arguments objectAtIndex:2] intValue];
    
    tcpSocket =  [[GCDAsyncSocket alloc] initWithDelegate:self delegateQueue:dispatch_get_main_queue()];
    
    NSString *host1 = @"192.168.1.1";
    int port1 =  49000;
    NSError *err = nil;
    [tcpSocket connectToHost:host1 onPort:port1 error:&err];
    
    NSString *receivePortString = [NSString stringWithFormat:@"%d", receivePort];
    NSString *sendPortString = [NSString stringWithFormat:@"%d", sendPort];
    NSString *body = [NSString stringWithFormat:
                      @"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"
                      "<s:Envelope s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">\n"
                      "<s:Body>\n"
                      "<u:AddPortMapping xmlns:u=\"urn:schemas-upnp-org:service:WANIPConnection:1\">"
                      "<NewRemoteHost></NewRemoteHost>"
                      "<NewExternalPort>"];
                      body = [NSString stringWithFormat:@"%@%@", body, random];
                      body = [NSString stringWithFormat:@"%@%@", body, @"</NewExternalPort>"
                      "<NewProtocol>UDP</NewProtocol>"
                      "<NewInternalPort>"];
                      body =[NSString stringWithFormat:@"%@%@", body, receivePortString];
                      body = [NSString stringWithFormat:@"%@%@", body, @"</NewInternalPort>"
                              "<NewInternalClient>"];
                      body =[NSString stringWithFormat:@"%@%@", body, ip];
                      body = [NSString stringWithFormat:@"%@%@", body, @"</NewInternalClient>"
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
 
}

-(void)socket:(GCDAsyncSocket *)sock didReadData:(NSData *)data withTag:(long)tag{
    
    NSLog(@"MESSAGE: %@", [NSString stringWithUTF8String:[data bytes]]);
    
}
@end