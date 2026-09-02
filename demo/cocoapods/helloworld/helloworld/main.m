//
//  main.m
//  helloworld
//
//  Created by linze on 2023/5/31.
//

#import <UIKit/UIKit.h>
#import "AppDelegate.h"

int main(int argc, char * argv[]) {
    NSString * appDelegateClassName;
    @autoreleasepool {
        // Setup code that might create autoreleased objects goes here.
        appDelegateClassName = NSStringFromClass([AppDelegate class]);
    }
    
    return UIApplicationMain(argc, argv, nil, appDelegateClassName);
}
