export default {
	desc: 'starts the Appc Daemon if it\'s not already running',
	options: {
		'--debug': 'starts the daemon in debug mode',
		'--debug-inspect': 'starts the daemon in debug mode and connects to the Node.js debugger'
	},
	async action({ argv }) {
		const { loadConfig, startServer } = await import('../common');

		const cfg = loadConfig(argv);

		try {
			await startServer({ cfg, argv });
			console.log('Appc Daemon started');
		} catch (err) {
			const code = err.exitCode || 1;
			console.error(`${err.message} (code ${code})`);
			process.exit(code);
		}
	}
};
