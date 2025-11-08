import UIKit
import Capacitor
import MobileCoreServices
import UniformTypeIdentifiers

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var sharedImageData: String?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.

        // Try to send shared image if it's pending
        if sharedImageData != nil {
            sendSharedImageToJS()
        }
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Check if the URL is an image file
        if isImageFile(url: url) {
            handleSharedImage(url: url)
            return true
        }

        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    private func isImageFile(url: URL) -> Bool {
        let imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "heic", "heif"]
        let fileExtension = url.pathExtension.lowercased()
        return imageExtensions.contains(fileExtension)
    }

    private func handleSharedImage(url: URL) {
        do {
            // Read image data
            let imageData = try Data(contentsOf: url)

            // Convert to UIImage to ensure it's a valid image and to normalize format
            guard let image = UIImage(data: imageData) else {
                print("Cap2Cal: Failed to create UIImage from data")
                return
            }

            // Convert to JPEG with 85% quality (matching Android implementation)
            guard let jpegData = image.jpegData(compressionQuality: 0.85) else {
                print("Cap2Cal: Failed to convert image to JPEG")
                return
            }

            // Convert to base64
            let base64String = jpegData.base64EncodedString()
            let dataUrl = "data:image/jpeg;base64,\(base64String)"

            // Store the data to send it when the bridge is ready
            sharedImageData = dataUrl

            // Send to JavaScript if bridge is already available
            sendSharedImageToJS()

            print("Cap2Cal: Shared image processed successfully")
        } catch {
            print("Cap2Cal: Error processing shared image: \(error.localizedDescription)")
        }
    }

    private func sendSharedImageToJS() {
        guard let imageData = sharedImageData else { return }

        // Get the bridge from the window's root view controller
        if let bridge = (window?.rootViewController as? CAPBridgeViewController)?.bridge {
            DispatchQueue.main.async {
                let data = """
                {"imageData": "\(imageData)"}
                """
                bridge.triggerWindowJSEvent(eventName: "sharedImage", data: data)
                print("Cap2Cal: Shared image sent to JavaScript")
                self.sharedImageData = nil
            }
        } else {
            // Bridge not ready yet, will be sent when it becomes available
            print("Cap2Cal: Bridge not ready, will retry")
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                self.sendSharedImageToJS()
            }
        }
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
