let args = process.argv.slice(2)
if (args.length < 1 || args.length > 2)
	process.exit(1)
const input = args[0]
const output = (args.length > 1) ? args[1] : input

const YAML = require('js-yaml')
const fs = require('fs')
const mjpage = require('mathjax-node-page').mjpage

mjpage(fs.readFileSync(input, 'utf8'), {
	format: ['AsciiMath'],
	output: 'svg',
	cssInline: false,
	MathJax: {
		ascii2jax: {
			delimiters: [['\\(', '\\)'], ['\\[', '\\]']],
		},
	},
	displayMessages: true,
	displayErrors: true,
}, {
	linebreaks: true,
	ex: 9, width: 60,
	useGlobalCache: true,
}, (doc) => {
	const { JSDOM } = require("jsdom");
	const dom = new JSDOM(doc)
	const { document } = dom.window

	const sandbox = require('sandboxed-module')
	const sandboxConfig = {
		globals: {
			window: dom.window, // used by function-plot
			document: document, // used by d3, function-plot uses window.document
			Element: dom.window.Element, // used by d3 and function-plot
			CSSStyleDeclaration: dom.window.CSSStyleDeclaration, // used by d3
		},
	}
	sandboxConfig.globals.window.d3 = sandbox.require('d3', sandboxConfig)
	const functionPlot = sandbox.require('function-plot', sandboxConfig)

	const elements = document.querySelectorAll('.function-plot')
	for (const target of elements) {
		const text = target.textContent
		target.innerHTML = ''

		const chart = functionPlot({
			target: target,
			disableZoom: true,
			...YAML.load(text),
		})
		const [ width, height ] = [
			chart.options.width,
			chart.options.height,
		]
		const plot = chart.root.node()
		plot.setAttribute('viewBox', `0 0 ${width} ${height}`)
		plot.removeAttribute('width')
		plot.removeAttribute('height')
		plot.remove()
		target.parentNode.insertBefore(plot, target)
		target.remove()
	}

	fs.writeFileSync(output, dom.serialize(), 'utf8')
})
