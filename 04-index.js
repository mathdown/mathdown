require('babel-es6-node-modules')(['ascii2mathml'])

const fs = require('fs')
const arg = require('arg')
const YAML = require('js-yaml')

const Markdown = require('markdown-it')
const hb = require('handlebars')

const mermaid = require('./mermaid.js')()
const graphDefinition = `
graph TB
	a-->b
`
mermaid.mermaidAPI.render('body', graphDefinition, (svgGraph) => console.log(svgGraph))

/* markdown-it plugins */

const plugins = [
	'markdown-it-emoji',
	'markdown-it-anchor',
	'markdown-it-toc-done-right',
	'./markdown-it-ascii2mathml.js',
	'./markdown-it-function-plot.js',
]
const configs = {
	'markdown-it-anchor': {
		permalink: true,
	},
}

/* parse arguments */

const readFile = (path) => fs.readFileSync(path, 'utf8')
const openFile = (path) => fs.openSync(path, 'w')

const args = arg({
	'-input': readFile,
	'-output': openFile,
	'-metadata': readFile,
	'-template': readFile,
})

const [
	input = readFile(0), // stdin
	output = 1, // stdout
	metadata = '',
	template = '{{{body}}}',
] = [
	args['-input'],
	args['-output'],
	args['-metadata'],
	args['-template'],
]

/* render markdown */

const md = new Markdown({
	html: true,
	breaks: true,
	typographer: true,
})

for (const plugin of plugins) {
	md.use(require(plugin), configs[plugin])
}

fs.writeSync(output, hb.compile(template)({
	body: md.render(input),
	...YAML.load(metadata),
}))
