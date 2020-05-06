#!/bin/sh -eux

# eslint-plugin-import has "files" blacklist in package.json and
# uses "prepublish" script for transpiling its source. That is,
# there is no "prepare" script and we can’t manually run prepublish
# because source files are not included.
#
# Below is a workaround to install this package from local folder.

eslint_plugin_import=third_party/eslint-plugin-import
(
	git clone -q --depth 1 https://github.com/benmosher/eslint-plugin-import $eslint_plugin_import
	git -C $eslint_plugin_import checkout -q 92caa3594e0f8d7bf143dedba0c7c2b47b541f34

	cd $eslint_plugin_import
	npm -s install --no-save --ignore-scripts --no-progress --no-fund \
		rimraf@2.7.1 babel-cli@6.26.0 babel-preset-es2015-argon@0.1.0
	npm -s run build
)

exec npm -s install --no-save --ignore-scripts --no-progress --no-fund \
	github:eslint/eslint#bd58eabd557ee38d03cd4fb65c0db1644d0dc843 \
	$eslint_plugin_import
