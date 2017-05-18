
lychee.define('app.state.Dialog').includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _COMPONENT = $.state('dialog', attachments["html"], attachments["css"]);
	const _OUTPUT    = _COMPONENT.query('p.response');
	const _INPUT     = _COMPONENT.query('input.command');
	const _State     = lychee.import('lychee.app.State');



	/*
	 * EASTER EGGS
	 */

	(function(commands, input) {

		let cmd = commands[(Math.random() * commands.length) | 0] || null;
		if (cmd !== null) {
			input.set('placeholder', cmd);
		}

	})([
		'search reddit for samaritan',
		'find sameen shaw',
		'locate harold finch',
		'browse /r/machinelearning',
		'investigate the machine',
		'explain artificial intelligence',
		'find samantha groves',
		'show the news'
	], _INPUT);


	_COMPONENT.state('active');



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(main) {

		_State.call(this, main);

	};


	Composite.prototype = {
	};


	return Composite;

});
