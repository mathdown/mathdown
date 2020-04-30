#!/usr/bin/env node

import fs from 'fs'
import arg from 'arg'
import yaml from 'js-yaml'
import subst from './subst.mjs'

import hl from '@mathdown/microlight'
import md from 'markdown-it'
import emoji from 'markdown-it-emoji'
import graph from './markdown-it-graph.mjs'
import anchor from 'markdown-it-anchor'
import funplot from './markdown-it-funplot.mjs'
import grammkit from './markdown-it-grammkit.mjs'
import deflist from 'markdown-it-deflist'
import ascii2mathml from './markdown-it-ascii2mathml.mjs'
import tableofcontents from 'markdown-it-toc-done-right'

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
	template = '${body}',
] = [
	args['-input'],
	args['-output'],
	args['-metadata'],
	args['-template'],
]

anchor.defaults.permalink = true

const config = {
	typography: true,
	highlight: (s) => `<pre class=microlight><code>${hl(s)}</code></pre>`,
}

fs.writeSync(output, subst(template, {
	...yaml.load(metadata),
	body: md(config)
		.use(emoji)
		.use(graph)
		.use(anchor)
		.use(funplot)
		.use(grammkit)
		.use(ascii2mathml)
		.use(tableofcontents)
		.render(input),
}))
