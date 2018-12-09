import jsdom from 'jsdom'
import sandbox from 'sandboxed-module'

const dom = new jsdom.JSDOM()
const context = {
	globals: {
		window: dom.window, // used by function-plot
		document: dom.window.document, // used by d3, function-plot uses window.document
		Element: dom.window.Element, // used by d3 and function-plot
		CSSStyleDeclaration: dom.window.CSSStyleDeclaration, // used by d3
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
