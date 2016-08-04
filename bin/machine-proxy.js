#!/usr/local/bin/lycheejs-helper env:node


const _ROOT = __dirname.split('/').slice(0, -1).join('/');

// lychee = require('lycheejs')(_ROOT);
// lychee.inject(lychee.ENVIRONMENTS['/libraries/lychee/dist']);

// TODO: Remove this development-mode stuff below
	require('/opt/lycheejs/libraries/lychee/build/node/core.js')('/opt/lycheejs');
	lychee.ROOT.lychee  = '/opt/lycheejs';
	lychee.ROOT.project = _ROOT;
// END TODO



const _ENV    = lychee.environment;
const _CONFIG = {
	debug:    false,
	sandbox:  false,
	build:    'app.Main',
	packages: _ENV.packages.concat(new lychee.Package('app', './lychee.pkg')),
	profile:  {
		host: null,
		port: 1337
	}
};

for (let prop in _CONFIG) {

	let m = 'set' + prop.charAt(0).toUpperCase() + prop.substr(1);
	let v = _CONFIG[prop];

	if (typeof _ENV[m] === 'function') {
		_ENV[m](v);
	}

}

lychee.envinit(_ENV, _CONFIG.profile);



setTimeout(function() {

	lychee.debug = true;

	console.info('machine-proxy: BOOTUP SUCCESS (' + process.pid + ')');


	let main = _ENV.global.MAIN || null;
	if (main !== null) {

		main.bind('destroy', (code) => {
			console.warn('machine-proxy: SHUTDOWN');
			process.exit(code);
		});

		process.on('SIGHUP',  () => { main.destroy(); this.exit(1); });
		process.on('SIGINT',  () => { main.destroy(); this.exit(1); });
		process.on('SIGQUIT', () => { main.destroy(); this.exit(1); });
		process.on('SIGABRT', () => { main.destroy(); this.exit(1); });
		process.on('SIGTERM', () => { main.destroy(); this.exit(1); });
		process.on('error',   () => { main.destroy(); this.exit(1); });
		process.on('exit',    () => {});


		new lychee.Input({
			key:         true,
			keymodifier: true
		}).bind('escape', function() {

			console.warn('machine-proxy: [ESC] pressed, exiting ...');
			main.destroy();

		}, this);

	} else {

		console.error('BOOTUP FAILURE');
		process.exit(1);

	}

}, 500);

