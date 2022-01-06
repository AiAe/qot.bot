import Bot from "./bot/Bot";
import Redis from "./redis/Redis";

class Program {
    public static async Main(): Promise<void> {
        await Redis.Initialize();
        await Bot.Initialize();
    }
}

Program.Main();