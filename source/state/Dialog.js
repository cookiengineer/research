
lychee.define('app.state.Dialog').includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _State       = lychee.import('lychee.app.State');
	const _STATE       = $.state('dialog', attachments["html"], attachments["css"]);
	const _ICON        = _STATE.query('div');
	const _HELP        = _STATE.query('small');
	const _INPUT       = _STATE.query('input.command');
	const _OUTPUT      = _STATE.query('p.response');
	const _SUGGESTIONS = [
		'search reddit for samaritan',
		'find sameen shaw',
		'locate harold finch',
		'browse /r/machinelearning',
		'locate the machine',
		'explain artificial intelligence',
		'find samantha groves'
	];



	/*
	 * HELPERS
	 */

	const _on_change = function(value) {

		let result = this.main.command(value);
		if (result === false) {

			_ICON.state('deny');
			_OUTPUT.value('Please rephrase command.');

			setTimeout(function() {

				_ICON.state('wait');

				setTimeout(function() {
					_OUTPUT.value('What are your commands?');
				}, 1000);

			}, 500);

		}

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

		update: function(data) {

			// XXX: Do nothing

		},

		enter: function(oncomplete) {

			_STATE.enter();
			_INPUT.value('');

			let suggestion = _SUGGESTIONS[(Math.random() * _SUGGESTIONS.length) | 0] || null;
			if (suggestion !== null) {
				_INPUT.attr('placeholder', suggestion);
			}

			_HELP.state('inactive');
			_INPUT.bind('change', _on_change, this);

			setTimeout(function() {

				if (_INPUT.value() === '') {
					_HELP.state('active');
				}

			}, 5000);


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
