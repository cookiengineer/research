
lychee.define('app.state.Dialog').requires([
]).includes([
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

		let bot = this.bot || null;
		if (bot !== null) {

			let intentions = bot.command(value.split(' ').map(function(word) {
				return word.replace(/(\?|\!|\.)/g, '').trim();
			}).filter(function(word) {
				return word !== '';
			}).join(' ')) || null;

			if (intentions.length > 0) {

				console.log('Intentions are', intentions);

				// if (intention.state === 'dialog') {
				// 	// TODO: Respond with response
				// } else {

				// 	let main = this.main;
				// 	if (main !== null) {
				// 		main.changeState(intention.state, intention.data);
				// 	}

				// }

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(main) {

		this.bot = main.bot || null;


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
