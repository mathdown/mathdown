/* render function plots using function-plot */

const YAML = require('js-yaml')
const funPlot = require('./funplot.js')()

function renderPlot(code) {
	const opts = YAML.load(code)
	const element = funPlot(opts)
	const [ width, height ] = [
		element.getAttribute('width'),
		element.getAttribute('height'),
	]
	element.removeAttribute('width')
	element.removeAttribute('height')
	element.setAttribute('viewBox', `0 0 ${width} ${height}`)
	return element.outerHTML
}

module.exports = (md) => {
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
