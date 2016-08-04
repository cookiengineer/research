#!/usr/bin/env node

const _ROOT = __dirname;

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


	let main = _ENV.global.MAIN;
	if (main !== undefined) {
		main.bind('destroy', (code) => process.exit(code));
	}

	// TODO: Remove this destroy() call
	setTimeout(() => main.destroy(0), 10000);

}, 500);

