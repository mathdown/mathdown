// Quick and dirty temporary workaround for https://github.com/felixge/node-sandboxed-module/pull/70

import url from 'url'

import sandbox from 'sandboxed-module'

const proto = sandbox.prototype
if (proto._inner_resolveFilename === undefined) {
	proto._inner_resolveFilename = proto._resolveFilename
	proto._resolveFilename = function _resolveFilename(trace) {
		this._inner_resolveFilename([{
			getFileName: () => {
				const fileName = trace[0].getFileName()
				if (fileName.startsWith('file://')) {
					return url.fileURLToPath(fileName)
				}
				return fileName
			},
		}])
	}
}
