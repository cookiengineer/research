
lychee.define('app.interface.Bot').requires([
	'app.interface.Intention'
]).exports(function(lychee, global, attachments) {

	const _Intention = lychee.import('app.interface.Intention');



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function() {

		this.intentions = [];

	};


	Composite.prototype = {



		/*
		 * BOT API
		 */

		command: function(sentence) {

			sentence = typeof sentence === 'string' ? sentence : null;


			if (sentence !== null) {

				let filtered   = [];
				let intentions = this.intentions;

				for (let i = 0, il = intentions.length; i < il; i++) {

					let intention   = intentions[i];
					let probability = intention.analyze(sentence);
					if (probability > 0.5) {

						filtered.push({
							probability: probability,
							intention:   intention.clone(sentence)
						});

					}

				}


				filtered.sort(function(a, b) {

					if (a.probability > b.probability) return -1;
					if (b.probability > a.probability) return  1;
					return 0;

				});


				// XXX: If first intention is likely, skip the rest
				if (filtered[0].probability > 0.9) {
					return filtered.slice(0, 1);
				} else {
					return filtered;
				}

			}

			return null;

		},



		/*
		 * CUSTOM API
		 */

		addIntention: function(intention) {

			intention = intention instanceof _Intention ? intention : null;


			if (intention !== null) {

				this.intentions.push(intention);

				return true;

			}


			return false;

		},

		removeIntention: function(intention) {

			intention = intention instanceof _Intention ? intention : null;


			if (intention !== null) {

				let index = this.intentions.indexOf(intention);
				if (index !== -1) {
					this.intentions.splice(index, 1);
				}

				return true;

			}


			return false;

		}

	};


	return Composite;

});

