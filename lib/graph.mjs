import jsdom from 'jsdom'
import dot from 'ngraph.fromdot'
import sandbox from 'sandboxed-module'

const dom = new jsdom.JSDOM()

const Viva = sandbox.require('vivagraphjs', {
	globals: {
		window: {
			document: {
				// Used by simplesvg.
				//
				// TODO: patch Viva.Graph.View.svgGraphics to use custom createSvgRoot function
				//
				// simplesvg source code:
				//
				//    function svg(element, attrBag) {
				//      var svgElement = augment(element);
				//      if (attrBag === undefined) {
				//        return svgElement;
				//      }
				//
				//      svgElement.attr(attrBag);
				//
				//      return svgElement;
				//    }
				//
				//    function augment(element) {
				//      var svgElement = element;
				//
				//      if (typeof element === "string") {
				//        svgElement = window.document.createElementNS(svgns, element);
				//      } else if (element.simplesvg) {
				//        return element;
				//      }
				//
				//     ...monkey patching svg element...
				//
				// Looks like simplesvg will not access the function below if we pass an existing element to svg().
				createElementNS: (...args) => dom.window.document.createElementNS(...args),
			},
		},
	},
})

// TODO options
function render(def) {
	const graph = dot(def)

	const layout = Viva.Graph.Layout.forceDirected(graph, {
		springLength: 10,
		springCoeff: 0.0005,
		dragCoeff: 0.02,
		gravity: -1.2,
	})
	// TODO: remove magic 1000 iterations
	for (let i = 0; i < 1000; ++i) {
		layout.step()
	}
	const { x1, y1, x2, y2 } = layout.getGraphRect()
	const [ w, h ] = [ Math.abs(x2 - x1), Math.abs(y2 - y1) ]

	const graphics = Viva.Graph.View.svgGraphics()
	graph.forEachNode((node) => {
		const nodePosition = layout.getNodePosition(node.id)
		graphics.addNode(node, nodePosition)
	})
	graph.forEachLink((link) => {
		const linkPosition = layout.getLinkPosition(link.id)
		graphics.addLink(link, linkPosition)
	})

	graphics.beginRender()
	graphics.renderLinks()
	graphics.renderNodes()
	graphics.endRender()

	const svgRoot = graphics.getGraphicsRoot()
	svgRoot.setAttribute('viewBox', `${x1} ${y1} ${w} ${h}`)
	svgRoot.setAttribute('height', `${h}`)
	svgRoot.setAttribute('width', `${w}`)
	return svgRoot
}

export {
	render,
}

export default {
	render,
}
