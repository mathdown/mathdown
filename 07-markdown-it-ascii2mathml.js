/* render math using ascii2mathml */

const ascii2mathml = require('ascii2mathml').default

module.exports = (md) => {
	const [renderFence, renderCodeInline] = [
		md.renderer.rules.fence,
		md.renderer.rules.code_inline,
	]
	md.renderer.rules.fence = (tokens, idx, options, env, self) => {
		const token = tokens[idx];
		if (token.info != "math")
			return renderFence(tokens, idx, options, env, self);
		return ascii2mathml(token.content, { display: 'block' })
	}
	md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
		const { content } = tokens[idx];
		const prefix = "math "
		if (!content.startsWith(prefix))
			return renderCodeInline(tokens, idx, options, env, self)
		return ascii2mathml(content.substr(prefix.length), { display: 'inline' })
	}
}
