const socket = io();

socket.on("set state", (data) => {
	console.log(data);
	setCards(data.cards);
	setDecks(data.decks);
});

socket.on("delete card", (id) => {
	Card.Instances[id].remove();
	delete Card.Instances[id];
});

socket.on("delete deck", (id) => {
	Deck.Instances[id].remove();
	delete Deck.Instances[id];
});

const setCards = cards => setElements("card-element", Card.Instances, cards);
/** @returns {Card} */
const createCard = card => createElement("card-element", Card.Instances, card);

const setDecks = decks => setElements("deck-element", Deck.Instances, decks);
/** @returns {Deck} */
const createDeck = deck => createElement("deck-element", Deck.Instances, deck);

onSetElement("card", "card-element", Card.Instances, (card) => {
	card.setZindex();
});
onSetElement("deck", "deck-element", Deck.Instances);

/**
 * @template T
 * @param {string} type 
 * @param {string} tagName 
 * @param {Object<number, T>} Instances 
 * @param {(element: T) => {}} callback 
 */
function onSetElement(type, tagName, Instances, callback) {
	socket.on(`set ${type}`, (data) => {
		const element = Instances[data.id] || createElement(tagName, Instances, data);
		element.set(data);
		if (callback)
			callback(element);
	});
}

function setElements(tagName, Instances, elements) {
	document.querySelectorAll(tagName).forEach((element) => element.remove());
	for (const data of elements)
		createElement(tagName, Instances, data);
}

function createElement(tagName, Instances, data) {
	const element = document.createElement(tagName);
	element.set(data);
	Instances[data.id] = element;
	element.style.position = "absolute";
	document.body.appendChild(element);
	return element;
}