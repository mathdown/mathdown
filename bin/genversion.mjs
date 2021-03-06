import fs from 'fs'
import path from 'path'
import util from 'util'

const flags = {
	input: '',
	output: '',
}
const argv = process.argv
const argc = argv.length
if (argc < 2) {
	console.error('not enough arguments')
	process.exit(1)
}
for (let i = 2; i < argc; i++) {
	if (!argv[i].startsWith('-') || argv[i] === '--') {
		i++
		flags.args = argv.slice(i)
		break
	}
	switch (argv[i]) {
	case '-i':
	case '-input':
		i++
		if (i >= argc) {
			console.error('expected input file path')
			process.exit(1)
		}
		flags.input = argv[i]
		break
	case '-o':
	case '-output':
		i++
		if (i >= argc) {
			console.error('expected output file path')
			process.exit(1)
		}
		flags.output = argv[i]
		break
	default:
		const quoted = util.format('%O', argv[i])
		console.error(`unknown argument: ${quoted}`)
		process.exit(1)
	}
}

let inputFile = process.stdin.fd
if (flags.input !== '') {
	inputFile = flags.input
}
const input = fs.readFileSync(inputFile, 'utf8')

let outputFile = process.stdout.fd
if (flags.output !== '') {
	outputFile = flags.output
}
const output = fs.openSync(outputFile, 'w')

const json = JSON.parse(input)

let version = 'master'
if (json.version) {
	version = `v${json.version}`
}

const cwd = process.cwd()
const arg0 = path.relative(cwd, argv[1])
const args = argv.slice(2).join(' ')

const lines = [
	`// Code generated by ${arg0} ${args}; DO NOT EDIT.`,
	`export const version = ${util.format('%O', version)}`,
	`export { version as default }`,
]
let content = ''
for (const line of lines) {
	content += line + '\n'
}
fs.writeSync(output, content)
