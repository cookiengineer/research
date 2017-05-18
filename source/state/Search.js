
lychee.define('app.state.Search').includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _State = lychee.import('lychee.app.State');



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
			data['constructor'] = 'app.state.Search';


			return data;

		},

		deserialize: function(blob) {

			_State.prototype.deserialize.call(this, blob);

		},

		enter: function(oncomplete, data) {

			console.log('SEARCH', data);

			oncomplete(true);

		},

		leave: function(oncomplete) {

			oncomplete(true);

		}

	};


	return Composite;

});

