'use strict'

document.addEventListener('DOMContentLoaded', function() {
	for (const element of document.querySelectorAll('.railroad-container')) {
		element.onclick = onClickRailroadDiagram
		element.classList.add('clickable')
	}
})

function onClickRailroadDiagram(ev) {
	// Go to the rule definition if the node was clicked.
	if (ev.target.tagName === 'text') {
		location.hash = ev.target.textContent
	}
}
