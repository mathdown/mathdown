import jsdom from 'jsdom'
import sandbox from 'sandboxed-module'

// function-plot uses Math.random to generate element IDs.
//
// We want our document generation to be deterministic, so
// we just create a new Math object and patch method random.
//
// Hopefully we won’t break d3 and some other dependencies.
const notRandomMath = {}
const props = Object.getOwnPropertyDescriptors(Math)
props.random.value = () => 0
Object.defineProperties(notRandomMath, props)

const dom = new jsdom.JSDOM()
const context = {
	globals: {
		// Used by function-plot.
		window: dom.window,

		// Used by d3, function-plot uses window.document.
		document: dom.window.document,

		// Used by d3 and function-plot.
		Element: dom.window.Element,

		// Used by d3.
		CSSStyleDeclaration: dom.window.CSSStyleDeclaration,

		// Used by key-pressed (function-plot dependency).
		process: { browser: undefined },

		// See comment for notRandomMath.
		Math: notRandomMath,
	},
}
// function-plot uses window.d3 instead of global variable
context.globals.window.d3 = sandbox.require('d3', context)
const functionPlot = sandbox.require('function-plot', context)

function render(config) {
	const body = dom.window.document.body
	const chart = functionPlot({
		...config,
		target: body,
	})
	const element = chart.root.node()
	element.remove()
	return element
}

export {
	render,
}

export default {
	render,
}
