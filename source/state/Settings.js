
lychee.define('app.state.Settings').includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _STATE   = $.state('settings', attachments["html"], attachments["css"]);
	const _ARTICLE = _STATE.query('article');
	const _FOOTER  = _STATE.query('footer');
	const _State   = lychee.import('lychee.app.State');


	(function(footer) {

		let link = footer.query('a');
		if (link !== null) {

			link.bind('click', function(value) {

				let main = global.MAIN || null;
				if (main !== null) {

					main.changeState('browse', {
						plugin: 'generic',
						url:    value
					});

				}

			}, this);

		}

	})(_FOOTER);



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
			data['constructor'] = 'app.state.Settings';


			return data;

		},

		enter: function(oncomplete, data) {

			_STATE.enter();
			console.log('SETTINGS', data);

			_State.prototype.enter.call(this, oncomplete);

		},

		leave: function(oncomplete) {

			_STATE.leave();

			_State.prototype.leave.call(this, oncomplete);

		}

	};


	return Composite;

});

