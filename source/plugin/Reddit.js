
lychee.define('app.plugin.Reddit').requires([
	'app.interface.Intention'
]).exports(function(lychee, global, attachments) {

	const _Intention = lychee.import('app.interface.Intention');
	const _BLOB      = attachments["json"].buffer;



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

			if (blob.intentions instanceof Array) {

				let bot = this.bot || null;
				if (bot !== null) {

					for (let i = 0, il = blob.intentions.length; i < il; i++) {
						bot.addIntention(new _Intention(blob.intentions[i]));
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

