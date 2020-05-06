import ascii2mathml from 'mathup'

function mathupPlugin(md) {
	const [ renderFence, renderCodeInline ] = [
		md.renderer.rules.fence,
		md.renderer.rules.code_inline,
	]
	md.renderer.rules.fence = (tokens, idx, options, env, self) => {
		const token = tokens[idx]
		if (token.info !== 'math') {
			return renderFence(tokens, idx, options, env, self)
		}
		const math = ascii2mathml(token.content, {
			display: 'block',
			annotate: true,
		})
		return `<div class="math block">${math}</div>`
	}
	md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
		const { content } = tokens[idx]
		const dollar = '$'
		if (!content.startsWith(dollar) || !content.endsWith(dollar)) {
			return renderCodeInline(tokens, idx, options, env, self)
		}
		const slice = content.slice(dollar.length, -dollar.length)
		const math = ascii2mathml(slice, {
			display: 'inline',
			annotate: true,
		})
		return `<div class="math inline">${math}</div>`
	}
}

export {
	mathupPlugin as default,
	mathupPlugin,
}
