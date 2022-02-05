import * as redis from "redis";
import Bot from "../bot/Bot";

const config = require("../config/config.json");


export default class Redis {
    public static async Initialize(): Promise<void> {
        const r = redis.createClient({
            // @ts-ignore
            port: config.redis.port,
            host: config.redis.host,
            password: config.redis.password
        });

        const sub = r.duplicate();
        await sub.connect();

        const sub2 = r.duplicate();
        await sub2.connect();

        const sub3 = r.duplicate();
        await sub3.connect();

        await sub.subscribe('qot_database_discord', function (msg: any) {
            try {
                const user = JSON.parse(msg);
                Bot.HandlePlayer(user);
            } catch (err) {
                console.log('Failed to parse msg');
            }
        });

        await sub2.subscribe('qot_database_discord_remove', function (msg: any) {
            try {
                const user = JSON.parse(msg);
                Bot.HandleRemovePlayer(user);
            } catch (err) {
                console.log('Failed to parse msg');
            }
        });

        await sub3.subscribe('qot_database_discord_check', function (msg: any) {
            try {
                const user = JSON.parse(msg);
                Bot.IsPlayerInServer(user);
            } catch (err) {
                console.log('Failed to parse msg');
            }
        });
    }
}