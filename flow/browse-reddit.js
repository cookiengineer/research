
setTimeout(function() {

	const _window = require('nw.gui').Window.get();

	_window.width  = 960;
	_window.height = 1080;
	_window.x = 1280;
	_window.y = 0;


	const _browse = Polyfillr.get('state-browse').elements[0];
	const _dialog = Polyfillr.get('state-dialog').elements[0];


	let input = _dialog.querySelector('input.command');
	if (input !== null) {

		input.value = 'browse /r/programming';
		input.onchange();

	}

}, 2000);

