#!/usr/local/bin/lycheejs-helper env:node

require('/opt/lycheejs/libraries/lychee/build/node/core.js')(__dirname);



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


	lychee.pkginit('node/main', {
		debug:   false,
		sandbox: false
	}, {
		renderer: null,
		client:   null
	});

})(lychee, typeof global !== 'undefined' ? global : this);

