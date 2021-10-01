import { render, html, svg } from './lib/uhtml.js';

export { render, html, svg };

const trigger = e => e.composedPath()[0];
const matchesTrigger = (e, selectorString) => trigger(e).matches(selectorString);

const isObj = x => typeof x === 'object' && x !== null && !Array.isArray(x);

export function makeComponent(config) {
	let { 
		name, 
		template, 
		onConstruct,
		onConnected, 
		onRender, 
	} = config;

	if (!name) throw "Component requires name.";
	if (!template) template = host => html``;
	if (!onConstruct) onConstruct = null; // host => {};
	if (!onConnected) onConnected = null; // host => {};
	if (!onRender) onRender = null; //host => {};

	class Temp extends HTMLElement {
		constructor() {
			super();

			this.attachShadow({ mode: "open" });

			if (onConstruct !== null) onConstruct(this);
			
			this.render();
		}

		on(eventName, selectorString, event) { // focus doesn't work with this, focus doesn't bubble, need focusin
			this.shadowRoot.addEventListener(eventName, (e) => {
				e.trigger = trigger(e); // Do I need this? e.target seems to work in many (all?) cases
				if (selectorString === "" || matchesTrigger(e, selectorString)) event(e, this);
			})
		}

		// use in onConstruct
		useState(init, strict = false) {
			for (const name in init) {
				const value = init[name];
				addProp(name, value, strict, this);
			}
		}

		// maybe
		useProp(name, value, strict = false) {
			addProp(name, value, strict, this);
		}

		setProp(name, value) {
			if (!(name in this)) throw "No prop with that name.";
			else {
				this[name] = value;
				this.render();
			}
		}

		// lifecycle
		connectedCallback() { 
			if (onConnected !== null) onConnected(this);
		}
		
		render() {
			console.log("rendered")
			if (onRender !== null) onRender(this);
			render(this.shadowRoot, template(this));
		}
	}

	window.customElements.define(name, Temp);
}

function addProp(name, value, strict, that) {
	if (name in that) throw "Can't 'addProp' property name already in use.";

	let scopedValue = value;

	let type = "";
	if (strict === true) type = typeof value; // TODO: should I use inference or pass type

	Object.defineProperty(that, name, {
	    get: () => scopedValue,
	    set: (newValue) => {
	    	if (strict && typeof newValue !== type) {
	    		throw `Attempted to assign wrong type to property '${name}', expected ${type} but received ${typeof newValue}.`;
	    	}

	    	scopedValue = newValue;
	    	that.render();
	    }
	});
}
