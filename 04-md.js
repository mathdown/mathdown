let args = process.argv.slice(2)
if (args.length < 1 || args.length > 2)
	process.exit(1)
const input = args[0]let args = process.argv.slice(2)
if (args.length < 1 || args.length > 4)
	process.exit(1)
const input = args[0]
const output = (args.length > 1) ? args[1] : input
const template = (args.length > 2) ? args[2] : "template.html"
const metadata = (args.length > 3) ? args[3] : "metadata.yaml"

/* render math using ascii2mathml */

require('babel-es6-node-modules')(['ascii2mathml'])

const aml2mml = require('ascii2mathml').default
const [renderBlock, renderInline] = [
	aml2mml({ display: 'block' }),
	aml2mml({ display: 'inline' }),
]

function ascii2mathml(md) {
	const [renderFence, renderCodeInline] = [
		md.renderer.rules.fence,
		md.renderer.rules.code_inline,
	]
	md.renderer.rules.fence = (tokens, idx, options, env, self) => {
		const token = tokens[idx];
		if (token.info != "math")
			return renderFence(tokens, idx, options, env, self);
		return renderBlock(token.content)
	}
	md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
		const { content } = tokens[idx];
		const prefix = "math "
		if (!content.startsWith(prefix))
			return renderCodeInline(tokens, idx, options, env, self)
		return renderInline(content.substr(prefix.length))
	}
}

/* render function plots using function-plot */

const YAML = require('js-yaml')
const { JSDOM } = require("jsdom");
const dom = new JSDOM()
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
const funcPlot = sandbox.require('function-plot', sandboxConfig)

function renderPlot(code) {
	const config = YAML.load(code)
	const chart = funcPlot({
		target: document.body,
		...config,
	})
	const plot = chart.root.node()
	const [ width, height ] = [
		chart.options.width,
		chart.options.height,
	]
	const element = chart.root.node()
	element.setAttribute('viewBox', `0 0 ${width} ${height}`)
	element.removeAttribute('width')
	element.removeAttribute('height')
	return element.outerHTML
}

function functionPlot(md) {
	const [renderFence, renderCodeInline] = [
		md.renderer.rules.fence,
		md.renderer.rules.code_inline,
	]
	md.renderer.rules.fence = (tokens, idx, options, env, self) => {
		const token = tokens[idx];
		if (token.info != "function-plot")
			return renderFence(tokens, idx, options, env, self);
		return renderPlot(token.content)
	}
}

/* render markdown */

const fs = require('fs')
const hb = require('handlebars')
const Markdown = require('markdown-it')
const emoji = require('markdown-it-emoji')
const anchor = require("markdown-it-anchor")
const toc = require('markdown-it-toc-done-right')

const md = new Markdown({
	html: true,
	breaks: true,
	typographer: true,
})
md.use(ascii2mathml)
md.use(functionPlot)
md.use(anchor, {
	permalink: true,
	permalinkSymbol: '⚓',
})
md.use(emoji)
md.use(toc)

const doc = fs.readFileSync(input, 'utf8')
const tpl = fs.readFileSync(template, 'utf8')
const cfg = fs.readFileSync(metadata, 'utf8')

const page = hb.compile(tpl)({
	pagetitle: input,
	body: md.render(doc),
	...YAML.load(cfg),
})

fs.writeFileSync(output, page, 'utf8')
