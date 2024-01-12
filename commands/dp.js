// require Nuggies
const Nuggies = require('nuggies');
const Discord = require('discord.js');




module.exports.run = async (client, message, args) => {
	if(!message.member.hasPermission('MANAGE_SERVER')) return message.reply('You do not have the permission \`MANAGE_SERVER\`');
    const dpmanager = new Nuggies.dropdownroles();
	message.channel.send('**Dropdown role process started!**\nplease type your roles in the follwing order, then say "done" when finished!\n\n`<roleID> <label> <emoji>`');






	const filter = m => m.author.id === message.author.id;
	const collector = message.channel.createMessageCollector(filter, { max: 10000 });

	collector.on('collect', async (msg) => {
		if (!msg.content) return message.channel.send('Invalid syntax');
		if (msg.content.toLowerCase() == 'done') return collector.stop('DONE');


		const roleid = msg.content.split(' ')[0];
		const role = message.guild.roles.cache.get(roleid);
		if (!role) return message.channel.send('Invalid role');

		const label = msg.content.split(' ').slice(1, msg.content.split(' ').length - 1).join(' ');

		const reaction = (await msg.react(msg.content.split(' ').slice(msg.content.split(' ').length - 1).join(' ')).catch(/*() => null*/console.log));

		const final = {
			role: roleid, label: label, emoji: reaction ? reaction.emoji.id || reaction.emoji.name : null,
		};
		dpmanager.addrole(final);
	})

	collector.on('end', async (msgs, reason) => {
		if (reason == 'DONE') {
			const embed = new Discord.MessageEmbed()
				.setTitle('Dropdown Regiments roles Picker!')
				.setDescription(':V1tal: **Self-Assignable Roles**')
				.setDescription('Please select with the according options to give yourself your roles.\n:BA: **Regiment Roles**\n:uksf - United Kingdom Special Forces\n:aab: - 16th Air Assault Brigade\n:ets: - Education and Training Services\n:ifd: - 1st Infantry Forces Division\n:rmp: - Royal Military Police\n:rgg: - The Grenadier Guards\n**Notification Roles**\n:announcement: - Get notified by news related to this server and more.\n:events: - Get notified by events, related to special events will be hosted by councils, allied members and more in the future\nTo prevent abuse, all the staffs will be watching the logs.')
        .setImage('https://cdn.discordapp.com/attachments/1189131714379915344/1193233352065552414/1.png?ex=65abf828&is=65998328&hm=56f18dd1c797ca715c30f1bb63d94b05b7dfa62548390fd69aa81ced29c4ffc4&')
				.setColor('#2de2e2')
				.setTimestamp()
        .setFooter("V1tal Dropdown Roles Panel")
			Nuggies.dropdownroles.create({ message: message, content: embed, role: dpmanager, channelID: message.channel.id })
		}
	});
};

module.exports.config = {
	name: 'dp',
	description: 'Creates dropdown role!',
	usage: '.dp',
	botPerms: [],
	userPerms: ['MANAGE_GUILD'],
	aliases: [],
};