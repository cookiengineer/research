
lychee.define('app.state.Browse').includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _State = lychee.import('lychee.app.State');



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function State(main) {

		_State.call(this, main);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			let data = _State.prototype.serialize.call(this);
			data['constructor'] = 'app.state.Browse';


			return data;

		},

		deserialize: function(blob) {

			_State.prototype.deserialize.call(this, blob);

		},

		enter: function(oncomplete) {

			console.log('Browse State');

			oncomplete(true);

		},

		leave: function(oncomplete) {

			oncomplete(true);

		}

	};


	return Composite;

});
