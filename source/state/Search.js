
lychee.define('app.state.Search').includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _COMPONENT = $.state('search', attachments["html"], attachments["css"]);
	const _ARTICLE   = _COMPONENT.query('article');
	const _State     = lychee.import('lychee.app.State');



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

		enter: function(oncomplete, data) {

			_COMPONENT.state('active');
			console.log('SEARCH', data);

			_State.prototype.enter.call(this, oncomplete);

		},

		leave: function(oncomplete) {

			_COMPONENT.state('inactive');

			_State.prototype.leave.call(this, oncomplete);

		}

	};


	return Composite;

});

