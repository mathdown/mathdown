const jsdom = require('jsdom')
const sandbox = require('sandboxed-module')

const dom = new jsdom.JSDOM()

const context = {
	//singleOnly: true,
	globals: {
		window: dom.window,
		...global,
	},
}

const mod = sandbox.load('vivagraphjs', context).module
const Viva = mod.exports
Viva.Graph.serializer = () => {
	return {
		loadFromJSON: mod.require('ngraph.fromjson'),
		storeToJSON: mod.require('ngraph.tojson'),
		loadFromDOT: mod.require('ngraph.fromdot'),
	}
}

const container = dom.window.document.body

/*
var graphGenerator = Viva.Graph.generator()

const graph = Viva.Graph.serializer().loadFromDOT(`
digraph G {
	a[x=10 y=20];
	b[x=20 y=20];
	a -> b;
}`)

var layout = Viva.Graph.Layout.constant(graph)

var renderer = Viva.Graph.View.renderer(graph, {
	layout: layout,
	container: container,
});
renderer.run()
*/

dom.window.document.documentElement.style.width = '100%'
dom.window.document.documentElement.style.height = '100%'
dom.window.document.body.style.width = '100%'
dom.window.document.body.style.height = '100%'

const graph = Viva.Graph.graph()
const nodePositions = [{x : -50, y: 0}, {x : 0, y: -50}, {x : 50, y: 0}]
const layout = Viva.Graph.Layout.constant(graph)
const renderer = Viva.Graph.View.renderer(graph, {
	layout: layout,
})

for(const i in nodePositions) {
	graph.addNode(i, nodePositions[i])
}

const count = nodePositions.length
for(const i in nodePositions) {
	graph.addLink(i % count, (i + 1) % count);
}

const { x1, y1, x2, y2 } = layout.getGraphRect()
process.stderr.write(`
(${x1}, ${y1}) (${x2}, ${y2})
`)

layout.placeNode(function(node) {
	return nodePositions[node.id]
})

renderer.run()

container.firstChild.style.width = '100%'
container.firstChild.style.height = '100%'

console.log(dom.serialize())
