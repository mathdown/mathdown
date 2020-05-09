'use strict'

document.addEventListener('DOMContentLoaded', function() {
	const url = new URL(window.location.href)
	const q = url.searchParams.get('mathjax')
	switch (q) {
	case '0':
	case 'no':
	case 'disable':
		return
	case '1':
	case 'yes':
	case 'force':
		loadMathJax()
		return
	}
	if(!engineMathMLSupport() && !empiricMathMLSupport()) {
		loadMathJax()
	}
})

function loadMathJax() {
	const s = document.createElement('script')
	s.setAttribute('type', 'text/javascript')
	s.setAttribute('async', '')
	s.setAttribute('src', 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/mml-chtml.js')
	document.head.appendChild(s)
}

// https://developer.mozilla.org/en-US/docs/Web/MathML/Authoring#Fallback_for_Browsers_without_MathML_support
function empiricMathMLSupport() {
	const div = document.createElement('div')
	div.innerHTML = '<math><mspace height=23px width=77px/></math>'
	document.body.appendChild(div)
	const box = div.firstChild.firstChild.getBoundingClientRect()
	document.body.removeChild(div)
	return Math.abs(box.height - 23) <= 1 && Math.abs(box.width - 77) <= 1
}

function engineMathMLSupport() {
	const ua = navigator.userAgent
	const isGecko = ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1 && ua.indexOf('Trident') === -1
	const isWebKit = ua.indexOf('AppleWebKit') > -1 && ua.indexOf('Chrome') === -1
	return isGecko || isWebKit
}
