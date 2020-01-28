'use strict'

document.addEventListener("DOMContentLoaded", function() {
  for (const element of document.querySelectorAll('.railroad-container')) {
    element.onclick = onClickRailroadDiagram
    element.classList.add('clickable')
  }
})

document.addEventListener("DOMContentLoaded", function() {
  if(!empiricMathMLSupport() && !engineMathMLSupport()) {
    loadMathJax()
  }
})

function loadMathJax() {
  var script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=MML_HTMLorMML'
  document.head.appendChild(script)
}

// https://developer.mozilla.org/en-US/docs/Web/MathML/Authoring#Fallback_for_Browsers_without_MathML_support
function empiricMathMLSupport() {
  var div = document.createElement('div')
  div.innerHTML = '<math><mspace height=23px width=77px/></math>'
  document.body.appendChild(div)
  var box = div.firstChild.firstChild.getBoundingClientRect()
  document.body.removeChild(div)
  return Math.abs(box.height - 23) <= 1 && Math.abs(box.width - 77) <= 1
}
function engineMathMLSupport() {
  var ua = navigator.userAgent
  var isGecko = ua.indexOf("Gecko") > -1 && ua.indexOf("KHTML") === -1 && ua.indexOf('Trident') === -1
  var isWebKit = ua.indexOf('AppleWebKit') > -1 && ua.indexOf('Chrome') === -1
  return isGecko || isWebKit
}

function onClickRailroadDiagram(ev) {
  // if the node was clicked then go to rule definition
  if (ev.target.tagName === 'text') {
    location.hash = ev.target.textContent;
  }
}
