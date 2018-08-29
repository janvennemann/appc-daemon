const fs     = require('fs');
const Module = require('module');
const path   = require('path');

const profiles = {
	"node4": {
		"plugins": [
			"dynamic-import-node",
			"@babel/plugin-transform-async-to-generator",
			"transform-class-properties",
			"transform-es2015-destructuring",
			"transform-es2015-modules-commonjs",
			"transform-es2015-parameters",
			"transform-object-rest-spread"
		]
	},

	"node6": {
		"plugins": [
			"dynamic-import-node",
			"@babel/plugin-transform-async-to-generator",
			"transform-class-properties",
			"transform-es2015-destructuring",
			"transform-es2015-modules-commonjs",
			"transform-object-rest-spread"
		]
	},

	"node7": {
		"plugins": [
			"dynamic-import-node",
			"transform-class-properties",
			"transform-es2015-modules-commonjs",
			"transform-object-rest-spread"
		]
	},

	"node8": {
		"plugins": [
			"dynamic-import-node",
			"transform-class-properties",
			"transform-es2015-modules-commonjs",
			"transform-object-rest-spread"
		]
	},

	"node8.10": {
		"plugins": [
			"dynamic-import-node",
			"transform-class-properties",
			"transform-es2015-modules-commonjs"
		]
	},

	"node10": {
		"plugins": [
			"dynamic-import-node",
			"transform-class-properties",
			"transform-es2015-modules-commonjs"
		]
	}
};

module.exports = function getBabelConf(opts) {
	const name = process.env.APPCD_BABEL_CONF = [
		opts && opts.babel,
		process.env.APPCD_BABEL_CONF,
		'node8'
	].reduce((p, n) => !p && n && profiles[n] ? n : p);

	const babelConf = profiles[name];

	for (let plugin of babelConf.plugins) {
		plugin = `babel-plugin-${plugin}`;
		(function inject(dir) {
			for (const name of fs.readdirSync(dir)) {
				const subdir = path.join(dir, name);
				try {
					if (fs.statSync(subdir).isDirectory()) {
						const resolvedModule = Module._resolveLookupPaths(plugin, {
							filename: plugin,
							paths: Module._nodeModulePaths(subdir)
						});
						const cacheKey = JSON.stringify({
							request: plugin,
							paths: resolvedModule[1]
						});
						Module._pathCache[cacheKey] = require.resolve(plugin);
						// inject(subdir);
					}
				} catch (e) {}
			}
		}(opts && opts.projectDir || process.cwd()));
	}

	return babelConf;
};
