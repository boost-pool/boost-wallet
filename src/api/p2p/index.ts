// @ts-ignore
import Meerkat from "@fabianbormann/meerkat";

export const createRoom = async (roomId:string) => {

    const meerkat = new Meerkat(
        roomId, {
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

};

export const joinRoom = async (roomId:string) => {

};

export const sendMessageRoom = async (roomId:string, message:any) => {

};
