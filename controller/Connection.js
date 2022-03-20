const { Socket } = require("socket.io");
const Game = require("../game/Game");
const Card = require("../game/objects/Card");
const Deck = require("../game/objects/Deck");
const Player = require("../game/Player");
const CardConnection = require("./Card");
const DeckConnection = require("./Deck");
const HandConnection = require("./Hand");


/**
 * @param {Socket} socket 
 */
function Connection(socket) {
	const player = new Player(socket);
	player.join(Game.Instance);
	const game = player.game;

	socket.on('disconnect', () => {
		clearHand(socket, player, game);
		player.leave();
	});

	socket.on("mouse move", (position) => {
		player.mouse = position;
		game.sync("set player", player, player);
	});

	socket.on("player data", (data, callback) => {
		player.set(data);
	});

	DeckConnection(socket, player, game);
	CardConnection(socket, player, game);
	HandConnection(socket, player, game);

	socket.emit("set state", player.gamestate);
}

/**
 * @param {Socket} socket 
 * @param {Player} player
 * @param {Game} game
 */
function clearHand(socket, player, game) {
	let i = 0;
	for (const item of player.hand) {
		const card = game.cards[item];
		card.playerHand = null;
		card.position = Card.Position({id: i});
		card.flipped = true;
		game.syncCard(card, player);
		i++;
	}
}

module.exports = Connection;