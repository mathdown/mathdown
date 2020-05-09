#!/usr/bin/env node

import fs from 'fs'
import os from 'os'
import util from 'util'

import handlebars from 'handlebars'
import yaml from 'js-yaml'

import mathdown from '../lib/mathdown.mjs'

const flags = {
	input: '',
	output: '',
	metadata: '',
	template: '',
	args: [],
}
const argv = [ ...process.argv ]
const argc = argv.length
if (argc < 2) {
	console.error('not enough arguments')
	process.exit(1)
}
for (let i = 2; i < argc; i++) {
	const isUnixArg = argv[i].startsWith('-')
	const isWindowsArg = argv[i].startsWith('/')
	const isArgument = isUnixArg || isWindowsArg
	if (!isArgument || argv[i] === '--') {
		i++
		flags.args = argv.slice(i)
		break
	}

	// Find value separator (if any).
	let j = -1
	for (const c of argv[i]) {
		j++
		const isUnixSep = (c === '=')
		const isWindowsSep = (c === ':')
		const isSep = isUnixSep || isWindowsSep
		if (!isSep) {
			continue
		}

		// Expand argument so that we don’t have
		// to care about separators later.

		const arg = argv[i].substring(0, j)
		const val = argv[i].substring(j + 1)

		argv[i] = arg
		argv.splice(i + 1, 0, val)

		break
	}

	switch (argv[i]) {
	case '-?':
	case '-h':
	case '-help':
	case '--help':
	case '/?':
	case '/h':
	case '/help':
		// TODO write help message.
		process.stdout.write(`mathdown${os.EOL}`)
		process.stdout.write(``)
		process.stdout.write(`TODO`)
		break
	case '-!':
	case '-v':
	case '-version':
	case '--version':
	case '/!':
	case '/v':
	case '/version':
		process.stdout.write(`MathDown ${mathdown.version}${os.EOL}`)
		process.exit(0)
		break
	case '-i':
	case '-input':
	case '--input':
	case '/i':
	case '/input':
		i++
		if (i >= argc) {
			console.error('expected input file path')
			process.exit(1)
		}
		flags.input = argv[i]
		break
	case '-o':
	case '-output':
	case '--output':
	case '/o':
	case '/output':
		i++
		if (i >= argc) {
			console.error('expected output file path')
			process.exit(1)
		}
		flags.output = argv[i]
		break
	case '-m':
	case '-metadata':
	case '--metadata':
	case '/m':
	case '/metadata':
		i++
		if (i >= argc) {
			console.error('expected metadata file path')
			process.exit(1)
		}
		flags.metadata = argv[i]
		break
	case '-t':
	case '-template':
	case '--template':
	case '/t':
	case '/template':
		i++
		if (i >= argc) {
			console.error('expected template file path')
			process.exit(1)
		}
		flags.template = argv[i]
		break
	default:
		const quoted = util.format('%O', argv[i])
		console.error(`unknown argument: ${quoted}`)
		process.exit(1)
	}
}

let inputFile = 0 // stdin
if (flags.input !== '') {
	inputFile = flags.input
}
const input = fs.readFileSync(inputFile, 'utf8')

let outputFile = 1 // stdout
if (flags.output !== '') {
	outputFile = fs.openSync(flags.output, 'w')
}
const output = outputFile

let metadataText = ''
if (flags.metadata !== '') {
	metadataText = fs.readFileSync(flags.metadata, 'utf8')
}
const metadata = yaml.load(metadataText)

let templateText = '<doctype html>{{{body}}}'
if (flags.template !== '') {
	templateText = fs.readFileSync(flags.template, 'utf8')
}
const template = handlebars.compile(templateText)

fs.writeSync(output, template({
	version: mathdown.version,
	...metadata,
	body: mathdown.render(input),
}))
