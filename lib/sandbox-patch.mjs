// Quick and dirty temporary workaround for https://github.com/felixge/node-sandboxed-module/pull/70

import url from 'url'

import sandbox from 'sandboxed-module'

sandbox.prototype._inner_resolveFilename = sandbox.prototype._resolveFilename
sandbox.prototype._resolveFilename = function(trace) {
	this._inner_resolveFilename([{
		getFileName: function() {
			const fileName = trace[0].getFileName()
			if (fileName.startsWith('file://')) {
				return url.fileURLToPath(fileName)
			}
			return fileName
		}
	}])
}
