
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



	/*
	 * HELPERS
	 */

	const _on_change = function(value) {

		console.log('WHAT', value);

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(main) {

		_State.call(this, main);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			let data = _State.prototype.serialize.call(this);
			data['constructor'] = 'app.state.Dialog';


			return data;

		},

		enter: function(oncomplete) {

			_COMPONENT.state('active');
			_INPUT.bind('change', _on_change, this);

			_State.prototype.enter.call(this, oncomplete);

		},

		leave: function(oncomplete) {

			_INPUT.unbind('change', _on_change, this);
			_COMPONENT.state('inactive');

			_State.prototype.leave.call(this, oncomplete);

		}

	};


	return Composite;

});
