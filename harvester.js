#!/usr/local/bin/lycheejs-helper env:node

const _ROOT = process.env.LYCHEEJS_ROOT || '/opt/lycheejs';

require(_ROOT + '/libraries/lychee/build/node/core.js')(__dirname);



/*
 * INITIALIZATION
 */

(function(lychee, global) {

	/*
	 * UI API
	 */

	global.$ = {
		query:  ()   => null,
		input:  ()   => null,
		output: ()   => null,
		view:   (id) => global.MAIN.changeState(id)
	};

	lychee.pkg('build', 'node/main', function(environment, profile) {

		if (environment !== null) {

			lychee.init(environment, {
				debug:   false,
				sandbox: false,
				profile: {
					renderer: null,
					client:   null
				}
			});

		}

	});


})(lychee, typeof global !== 'undefined' ? global : this);

