
lychee.define('app.plugin.Reddit').requires([
	'app.interface.Intent'
]).exports(function(lychee, global, attachments) {

	const _Intent = lychee.import('app.interface.Intent');
	const _BLOB   = attachments["json"].buffer;



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(main) {

		this.main = main     || null;
		this.bot  = main.bot || null;


		this.deserialize(_BLOB);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

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

		serialize: function() {

			return {
				'constructor': 'app.plugin.Reddit',
				'arguments':   []
			};

		},



		/*
		 * PLUGIN API
		 */

		browse: function(data) {

			data = data instanceof Object ? data : null;

			console.log('browse reddit', data);

		},

		search: function(data) {

			data = data instanceof Object ? data : null;

			console.log('search reddit', data);

		}

	};


	return Composite;

});

