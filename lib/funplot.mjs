import jsdom from 'jsdom'
import sandbox from 'sandboxed-module'

// function-plot uses Math.random to generate element IDs.
//
// We want our document generation to be deterministic, so
// we just create a new Math object and patch method random.
//
// Hopefully we won’t break some d3 and other dependencies.
const props = Object.getOwnPropertyDescriptors(Math)
props.random.value = () => 0
const notRandomMath = {}
Object.defineProperties(notRandomMath, props)

const dom = new jsdom.JSDOM()
const context = {
	globals: {
		window: dom.window, // used by function-plot
		document: dom.window.document, // used by d3, function-plot uses window.document
		Element: dom.window.Element, // used by d3 and function-plot
		CSSStyleDeclaration: dom.window.CSSStyleDeclaration, // used by d3
		process: { browser: undefined }, // used by key-pressed (function-plot dependency)
		Math: notRandomMath,
	},
}
// function-plot uses window.d3 instead of global variable
context.globals.window.d3 = sandbox.require('d3', context)
const functionPlot = sandbox.require('function-plot', context)

export default (config) => {
	const body = dom.window.document.body
	const chart = functionPlot({
		...config,
		target: body,
	})
	const element = chart.root.node()
	element.remove()
	return element
}
