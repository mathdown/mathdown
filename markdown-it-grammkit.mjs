import util from 'grammkit/lib/util'

function renderRailroad(grammar, format) {
	let string = ''
	const $ = (s) => { string += s + '\n' }
	util.transform(grammar, format).procesedGrammars.map(({ rules, references, name }, key) => {
		$(`<div class=grammar>`)
		if (name) {
			$(`<h2>${name}</h2>`)
		}
		/* TODO: highlight
		$(`<details>`)
		$(`<summary>Definition</summary>`)
		$(`<pre><code>${grammar}</code></pre>`)
		$(`</details>`)
		*/
		rules.map((rule, key) => {
			$(`<div>`)
			$(`<h3 id=${rule.name}>${rule.name}</h3>`)
			$(`<div class=railroad-container>${rule.diagram}</div>`)
			if (references[rule.name]) {
				if (references[rule.name].usedBy.length > 0) {
					$(`<div>Used By:`)
					references[rule.name].usedBy.map((rule, key) => {
						$(` <a href=#${rule}>${rule}</a>`)
					})
					$(`</div>`)
				}
				if (references[rule.name].references.length > 0) {
					$(`<div>References:`)
					references[rule.name].references.map((rule, key) => {
						$(`<a href=#${rule}> ${rule}</a>`)
					})
					$(`</div>`)
				}
			}
			$(`</div>`)
		})
		$(`</div>`)
	})
	return string
}

export default (md) => {
	const renderFence = md.renderer.rules.fence
	md.renderer.rules.fence = (tokens, idx, options, env, self) => {
		const token = tokens[idx]
		let format = token.info.toLowerCase()
		switch (format) {
		case "grammar":
			format = 'auto'
		case "peg.js":
		case "pegjs":
		case "ebnf":
		case "ohm":
			if (format === 'peg.js') {
				format = 'pegjs'
			}
			return renderRailroad(token.content, format)
		}
		return renderFence(tokens, idx, options, env, self);
	}
}
