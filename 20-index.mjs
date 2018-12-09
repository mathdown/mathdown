import fs from 'fs'
import arg from 'arg'
import yaml from 'js-yaml'
import md from 'markdown-it'
import mdEmoji from 'markdown-it-emoji'
import mdGraph from './markdown-it-graph'
import mdAnchor from 'markdown-it-anchor'
import mdFunplot from './markdown-it-funplot'
import mdGrammkit from './markdown-it-grammkit'
import mdAscii2mathml from './markdown-it-ascii2mathml'
import mdTocDoneRight from 'markdown-it-toc-done-right'
import { subst } from './template'

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

mdAnchor.defaults.permalink = true

import microlight from 'microlight'

fs.writeSync(output, subst(template, {
	...yaml.load(metadata),
	body: md({ highlight: (s) => microlight(s) })
		.enable('escape', true)
		.enable('html_blocks', true)
		.enable('smartquotes')
		.enable('replacements')
		.use(mdEmoji)
		.use(mdGraph)
		.use(mdAnchor)
		.use(mdFunplot)
		.use(mdGrammkit)
		.use(mdAscii2mathml)
		.use(mdTocDoneRight)
		.render(input),
}))
