const {Client} = require('discord.js')

const config = require("../config/config.json");

export default class Bot {
    public static Client = new Client({intents: ["GUILD_MEMBERS"]});

    public static async Initialize(): Promise<void> {
        await Bot.Client.login(config.bot.token);

        // Get Guild and cache members and roles on start
        const guild = await Bot.GetGuild();
        await guild.members.fetch();
        await guild.roles.fetch();
    }

    public static async HandlePlayer(player: any): Promise<void> {
        try {
            const user = await Bot.GetUser(player.discord_id);

            if (user == null)
                return console.log(`${player.discord_id} is not in the server`);

            const role = await Bot.GetRole();

            if (!role)
                return console.log(`Role not found`);

            try {
                await user.roles.add(role);
            } catch (err) {
                console.log('Failed to give player role, probably no permission');
            }

            try {
                await user.setNickname(player.discord_nick);
            } catch (err) {
                console.log('Failed to change player nickname, probably owner or no permission.');
            }

            console.log(`Successfully added role to ${player.discord_id} and changed their nick to ${player.discord_nick}`);
        } catch (err) {
            console.log(err);
        }
    }

    public static async HandleRemovePlayer(player: any): Promise<void> {
        try {
            const user = await Bot.GetUser(player.discord_id);

            if (user == null)
                return console.log(`${player.discord_id} is not in the server`);

            const role = await Bot.GetRole();

            if (!role)
                return console.log(`Role not found`);

            try {
                await user.roles.remove(role);
            } catch (err) {
                console.log('Failed to remove player role, probably no permission');
            }

            console.log(`Successfully removed ${player.discord_id} from tournament!`);
        } catch (err) {
            console.log(err);
        }
    }

    public static async GetGuild(): Promise<any> {
        try {
            return await Bot.Client.guilds.cache.get(config.bot.serverId);
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    public static async GetUser(id: any): Promise<any> {
        try {
            const guild = await Bot.GetGuild();
            return await guild.members.cache.get(id);
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    public static async GetRole(): Promise<any> {
        try {
            const guild = await Bot.GetGuild();
            return await guild.roles.cache.get(config.bot.roleId);
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}
