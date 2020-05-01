// Quick and dirty temporary workaround for https://github.com/felixge/node-sandboxed-module/pull/70

import sandbox from 'sandboxed-module'

sandbox.prototype._inner_resolveFilename = sandbox.prototype._resolveFilename
sandbox.prototype._resolveFilename = function(trace) {
	this._inner_resolveFilename([{
		getFileName: function() {
			return trace[0].getFileName().substring('file://'.length)
		}
	}])
}
