Mixins.MouseEvents = (objects) => {
	mixinEvent("mousedown", objects);
	mixinEvent("mouseup", objects, false);
	mixinEvent("mousemove", objects, false);
};

Mixins.HoverEvents = (object) => {
	object.addEventListener("mouseenter", object.mouseenter || ((e) => {object.hovering = true;}))
	object.addEventListener("mouseleave", object.mouseleave || ((e) => {object.hovering = false;}))
}

Mixins.KeyboardEvents = (objects) => {
	mixinEvent("keydown", objects, false);
	mixinEvent("keyup", objects, false);
};

function mixinEvent(name, objects, checkTarget = true, defaultImpl) {
	window.addEventListener(name, (e) => {
		for (const object of Object.values(objects)) {
			const func = (object[name] || defaultImpl);
			if(func)
			if (!checkTarget || e.target == object)
				func.bind(object)(e);
		}
	});
}