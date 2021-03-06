interface GameElement {
	id: number;
}

interface Card
	extends GameElement,
		HoverEvents,
		KeyboardEvents,
		MouseEvents,
		Transform,
		Draggable,
		ZIndexed {
	width: number;
}

interface Deck
	extends GameElement,
		HoverEvents,
		KeyboardEvents,
		MouseEvents,
		Transform,
		Draggable,
		ZIndexed {
	width: number;
}

interface GameObject
	extends GameElement,
		HoverEvents,
		KeyboardEvents,
		MouseEvents,
		Transform,
		Draggable,
		ZIndexed {
	width: number;
}

interface Dice
	extends GameElement,
		HoverEvents,
		KeyboardEvents,
		MouseEvents,
		Transform,
		Draggable,
		ZIndexed {
	width: number;
}


interface Math {
	clamp: (value: number, min: number, max: number) => number;
}
