import mathdown from '../lib/mathdown.mjs'

import mtest from 'm.test'
import snapshot from '@mathdown/snapshot'
import { strict } from 'assert'

import fs from 'fs'
import path from 'path'
import url from 'url'

const dirname = path.dirname(url.fileURLToPath(import.meta.url))

mtest.test('Snapshots', () => {
	const snapshots = [
		'funplot',
		'graph',
	]
	for (const name of snapshots) {
		mtest.test(name, () => {
			// TODO snapshot standalone HTML document.
			const [ input, output ] = [ `${name}.md`, `${name}.html.body` ]
			const filepath = path.join(dirname, 'testdata', input)
			const text = fs.readFileSync(filepath, 'utf8')
			const value = mathdown.render(text)
			snapshot(value, output, { dirname })
		})
	}
})
