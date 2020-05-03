import './sandbox-patch.mjs'

import hl from '@mathdown/microlight'
import md from 'markdown-it'
import emoji from 'markdown-it-emoji'
import graph from './markdown-it-graph.mjs'
import anchor from 'markdown-it-anchor'
import funplot from './markdown-it-funplot.mjs'
import grammkit from './markdown-it-grammkit.mjs'
import ascii2mathml from './markdown-it-ascii2mathml.mjs'
import tableofcontents from 'markdown-it-toc-done-right'

import { version as ver } from './version.mjs'

export const version = ver

export function render(input) {
	const config = {
		typography: true,
		highlight: (s) => `<pre class=microlight><code>${hl(s)}</code></pre>`,
	}
	return md(config)
		.use(emoji)
		.use(graph)
		.use(anchor, { permalink: true })
		.use(funplot)
		.use(grammkit)
		.use(ascii2mathml)
		.use(tableofcontents)
		.render(input)
}

export default {
	version,
	render,
}
