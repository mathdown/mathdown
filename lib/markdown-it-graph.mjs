import graph from './graph.mjs'

function renderGraph(code) {
	const element = graph.render(code)
	element.classList.add('graph')
	element.classList.add('dot')
	return element.outerHTML
}

export default (md) => {
	const renderFence = md.renderer.rules.fence
	md.renderer.rules.fence = (tokens, idx, options, env, self) => {
		const token = tokens[idx]
		if (token.info != "dot")
			return renderFence(tokens, idx, options, env, self);
		return renderGraph(token.content)
	}
}
