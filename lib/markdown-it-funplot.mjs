/* render function plots using function-plot */

import yaml from 'js-yaml'
import funplot from './funplot.mjs'

function renderPlot(code) {
	const opts = yaml.load(code)
	const element = funplot(opts)
	const [ width, height ] = [
		element.getAttribute('width'),
		element.getAttribute('height'),
	]
	//element.removeAttribute('width')
	//element.removeAttribute('height')
	element.setAttribute('viewBox', `0 0 ${width} ${height}`)
	return element.outerHTML
}

export default (md) => {
	const renderFence = md.renderer.rules.fence
	md.renderer.rules.fence = (tokens, idx, options, env, self) => {
		const token = tokens[idx]
		if (token.info != "function-plot")
			return renderFence(tokens, idx, options, env, self)
		return renderPlot(token.content)
	}
}
