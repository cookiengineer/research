
lychee.define('app.interface.Bot').requires([
	'app.interface.Intent'
]).exports(function(lychee, global, attachments) {

	const _Intent = lychee.import('app.interface.Intent');



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function() {

		this.intents = [];

	};


	Composite.prototype = {



		/*
		 * BOT API
		 */

		command: function(sentence) {

			sentence = typeof sentence === 'string' ? sentence : null;


			if (sentence !== null) {

				let filtered = [];
				let intents  = this.intents;

				for (let i = 0, il = intents.length; i < il; i++) {

					let intent      = intents[i];
					let probability = intent.analyze(sentence);
					if (probability > 0.5) {

						filtered.push({
							probability: probability,
							intent:      intent.clone(sentence)
						});

					}

				}


				filtered.sort(function(a, b) {

					if (a.probability > b.probability) return -1;
					if (b.probability > a.probability) return  1;
					return 0;

				});


				if (filtered.length > 0) {

					// XXX: If first intent is likely, skip the rest
					if (filtered[0].probability > 0.9) {
						return filtered.slice(0, 1);
					} else {
						return filtered;
					}

				}

			}

			return null;

		},



		/*
		 * CUSTOM API
		 */

		addIntent: function(intent) {

			intent = intent instanceof _Intent ? intent : null;


			if (intent !== null) {

				this.intents.push(intent);

				return true;

			}


			return false;

		},

		removeIntent: function(intent) {

			intent = intent instanceof _Intent ? intent : null;


			if (intent !== null) {

				let index = this.intents.indexOf(intent);
				if (index !== -1) {
					this.intents.splice(index, 1);
				}

				return true;

			}


			return false;

		}

	};


	return Composite;

});

