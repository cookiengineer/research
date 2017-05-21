
lychee.define('app.state.Dialog').includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _STATE  = $.state('dialog', attachments["html"], attachments["css"]);
	const _ICON   = _STATE.query('div');
	const _INPUT  = _STATE.query('input.command');
	const _OUTPUT = _STATE.query('p.response');
	const _State  = lychee.import('lychee.app.State');



	/*
	 * EASTER EGGS
	 */

	(function(commands, input) {

		let cmd = commands[(Math.random() * commands.length) | 0] || null;
		if (cmd !== null) {
			input.attr('placeholder', cmd);
		}

	})([
		'search reddit for samaritan',
		'find sameen shaw',
		'locate harold finch',
		'browse /r/machinelearning',
		'locate the machine',
		'explain artificial intelligence',
		'find samantha groves'
	], _INPUT);



	/*
	 * HELPERS
	 */

	const _on_change = function(value) {

		let main = this.main || null;
		let bot  = this.bot  || null;

		if (main !== null && bot !== null) {

			let suggestions = bot.command(value.split(' ').map(function(word) {
				return word.replace(/(\?|\!|\.)/g, '').trim();
			}).filter(function(word) {
				return word !== '';
			}).join(' '));

			if (suggestions !== null) {

				for (let s = 0, sl = suggestions.length; s < sl; s++) {

					let suggestion  = suggestions[s];
					let probability = suggestion.probability;
					let intent      = suggestion.intent;

					let action = intent.action || null;
					if (action !== null) {

						let check = main.getState(action);
						if (check !== null) {

							main.changeState(action, intent);

							break;

						} else {

							console.warn('Unknown Action "' + action + '" (' + probability.toFixed(2) + ')');
							console.warn(intent);

						}

					}

				}

			} else {

				_ICON.state('deny');
				_OUTPUT.value('Please rephrase command.');

				setTimeout(function() {

					_ICON.state('wait');

					setTimeout(function() {
						_OUTPUT.value('What are your commands?');
					}, 1000);

				}, 500);

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

			_STATE.enter();
			_INPUT.bind('change', _on_change, this);

			_State.prototype.enter.call(this, oncomplete);

		},

		leave: function(oncomplete) {

			_INPUT.unbind('change', _on_change, this);
			_INPUT.value('');
			_STATE.leave();

			_State.prototype.leave.call(this, oncomplete);

		}

	};


	return Composite;

});
