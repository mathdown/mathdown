import './sandbox-patch.mjs'

import hl from '@mathdown/microlight'
import markdown from 'markdown-it'
import anchor from 'markdown-it-anchor'
import emoji from 'markdown-it-emoji'
import tableofcontents from 'markdown-it-toc-done-right'

import ascii2mathml from './markdown-it-ascii2mathml.mjs'
import funplot from './markdown-it-funplot.mjs'
import grammkit from './markdown-it-grammkit.mjs'
import graph from './markdown-it-graph.mjs'
import { version } from './version.mjs'

const mdConfig = {
	highlight: (s) => `<pre class=microlight><code>${hl(s)}</code></pre>`,
	typography: true,
}

const md = markdown(mdConfig)
	.use(emoji)
	.use(graph)
	.use(anchor, { permalink: true })
	.use(funplot)
	.use(grammkit)
	.use(ascii2mathml)
	.use(tableofcontents)

function render(input) {
	return md.render(input)
}

export {
	render,
	version,
}

export default {
	render,
	version,
}
