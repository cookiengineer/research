
lychee.define('app.state.Help').requires([
	'app.interface.Intent'
]).includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _Intent  = lychee.import('app.interface.Intent');
	const _State   = lychee.import('lychee.app.State');
	const _BLOB    = attachments["json"].buffer;
	const _STATE   = $.state('help', attachments["html"], attachments["css"]);
	const _ARTICLE = _STATE.query('article');



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(main) {

		this.bot = main.bot || null;


		_State.call(this, main);

		this.deserialize(_BLOB);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			let data = _State.prototype.serialize.call(this);
			data['constructor'] = 'app.state.Help';


			return data;

		},

		deserialize: function(blob) {

			if (blob.intents instanceof Array) {

				let bot = this.bot || null;
				if (bot !== null) {

					for (let i = 0, il = blob.intents.length; i < il; i++) {
						bot.addIntent(new _Intent(blob.intents[i]));
					}

				}

			}

		},

		enter: function(oncomplete, data) {

			_STATE.enter();

			console.log('HELP', data);


			_State.prototype.enter.call(this, oncomplete);

		},

		leave: function(oncomplete) {

			_STATE.leave();


			_State.prototype.leave.call(this, oncomplete);

		}

	};


	return Composite;

});
