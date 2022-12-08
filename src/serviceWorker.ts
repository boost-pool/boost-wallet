// @ts-ignore
import Meerkat from "@fabianbormann/meerkat";
import {Capacitor} from "@capacitor/core";
import {LocalNotifications} from "@capacitor/local-notifications";
import {Toast} from "@capacitor/toast";
import { getRewardAddress } from "./api/extension";

const meerkat = new Meerkat(
    "bZqy8Big6pWTDeFTHz2Z6KLmuniqwRNXMT", {
        announce: [
            'udp://tracker.opentrackr.org:1337/announce',
            'udp://open.tracker.cl:1337/announce',
            'udp://opentracker.i2p.rocks:6969/announce',
            'https://opentracker.i2p.rocks:443/announce',
            'wss://tracker.files.fm:7073/announce',
            'wss://spacetradersapi-chatbox.herokuapp.com:443/announce',
            'ws://tracker.files.fm:7072/announce'
        ]
    });

console.log("meerkat object");
console.log(meerkat);
meerkat.on("server", function() {
    console.log("[info]: connected to server")
    meerkat.rpc("bZqy8Big6pWTDeFTHz2Z6KLmuniqwRNXMT", "api", {"api": {
            version: "1.0.3",
            name: 'boostwallet',
            methods: ["getRewardAddresses"]
        }});
});

meerkat.register("getRewardAddresses", (address:string, args:any, callback:Function) => {
    console.log("args");
    console.log(args);
    console.log("address");
    console.log(address);
    getRewardAddress().then(rwa => {
        console.log("rwa getRewardAddresses");
        console.log(rwa);
        callback([rwa]);
    });
});

meerkat.register("getRewardAddresses2", (address:string, args:any, callback:Function) => {
    callback(["e1820506cb0ce54ae755b2512b6cf31856d7265e8792cb86afc94e0872"]);
});



// Handle notifications
const handleNotifications = async () => {

    // const channelList = { "channels": [{ "id": "default", "name": "Default", "description": "Default", "importance": 3, "visibility": -1000, "sound": "content://settings/system/notification_sound", "vibration": false, "lights": false, "lightColor": "#000000" }, { "id": "pop-notifications", "name": "Pop Notifications", "description": "Pop Notifications", "importance": 0, "visibility": -1000, "sound": "content://settings/system/notification_sound", "vibration": true, "lights": true, "lightColor": "#000000" }] }

    let popNotif = false
    if (Capacitor.getPlatform() !== 'web') {
        const listChannel = await LocalNotifications.listChannels();
        const channels = listChannel.channels
        const print = channels.filter(channels => channels.id === 'pop-notifications');

        // @ts-ignore
        if (JSON.stringify(print[0].importance) > 0) {
            popNotif = true
        }
    } else {
        popNotif = true
    }

    const permission = await LocalNotifications.checkPermissions();
    if (popNotif && permission.display === 'granted') {
        LocalNotifications.addListener('localNotificationReceived', (notification) => {
            Toast.show({ text: 'You got a new notification!' });
        })
        LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
            Toast.show({ text: `Notification: ${JSON.stringify(notification.notification.body)}` });
        })
    } else {
        await LocalNotifications.requestPermissions();
    }
}
handleNotifications();
