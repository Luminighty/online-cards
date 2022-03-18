const { Socket } = require("socket.io");
const Game = require("../game/Game");
const Deck = require("../game/objects/Deck");
const Player = require("../game/Player");


/**
 * @param {Socket} socket 
 * @param {Player} player
 * @param {Game} game
 */
function DeckConnection(socket, player, game) {

	socket.on("deck move", (id, position, callback) => {
		DeckAction(game, player, callback, id, (deck) => deck.position = position);
	});

	socket.on("deck shuffle", (id, callback) => {
		DeckAction(game, player, callback, id, (deck) => {
			deck.shuffle();
			deck.updateImage(game.cards);
			socket.emit(`set deck`, deck.simplified(player));
		});
	});

	socket.on("deck addCard", (id, cardId, position, callback) => {
		DeckAction(game, player, callback, id, (deck) => {
			const card = game.cards[cardId];
			if (!card) {
				console.error(`Card not found: ${cardId}`);
				return;
			}
			deck.add(card, position);
			deck.updateImage(game.cards);
			game.broadcast("delete card", card.id);
			game.syncDeck(deck);
		});
	});

	socket.on("deck create", (cardIds, callback) => {
		const cards = cardIds.map((id) => game.cards[id]);
		const deck = new Deck({
			cards,
			position: cards[0].position,
		});
		game.decks[deck.id] = deck;
		deck.updateImage(game.cards);
		game.syncDeck(deck);
		cards.forEach((card) => game.broadcast("delete card", card.id));
	});

	socket.on("deck draw", (id, drag, callback) => {
		const deck = game.decks[id];
		if (!deck) {
			console.error(`Deck not found: ${id}`);
			return;
		}
		const cardId = deck.draw();
		const card = game.cards[cardId];
		if (!card) {
			console.error(`Card not found: ${cardId}`);
			return;
		}
		deck.updateImage(game.cards);
		card.position = Object.assign({}, deck.position);
		card.deck = null;
		callback(card.simplified(player), deck.simplified(player), drag);

		game.syncCard(card, player);

		if (deck.cards.length < 2) {
			game.deleteDeck(deck);
		} else {
			game.syncDeck(deck, player);
		}
	});
}

function DeckAction(game, player, callback, deckId, action) {
	const deck = game.decks[deckId];
	if (!deck) {
		console.error(`Deck not found: ${deckId}`);
		return;
	}
	action(deck);
	if (callback)
		callback(deck.simplified(player));
	deck.updateImage(game.cards);
	game.syncDeck(deck, player);
}

module.exports = DeckConnection;