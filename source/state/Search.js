
lychee.define('app.state.Search').includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _State  = lychee.import('lychee.app.State');
	const _INPUTS = {
		keywords:   $.input('#search-keywords'),
		archive:    $.input('#search-archive'),
		duckduckgo: $.input('#search-duckduckgo'),
		github:     $.input('#search-github'),
	};



	/*
	 * HELPERS
	 */

	const _on_browse = function(data) {

		console.log('BROWSE', data);

	};

	const _on_change = function(url) {

		let images  = _INPUTS.img.getValue();
		let videos  = _INPUTS.vid.getValue();
		let service = this.client.getService('control');

		if (service !== null) {

			service.browse({
				url:    url,
				images: images === true,
				videos: videos === true
			});

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
			data['constructor'] = 'app.state.Search';


			return data;

		},

		deserialize: function(blob) {

			_State.prototype.deserialize.call(this, blob);

		},

		enter: function(oncomplete) {

			oncomplete(true);

		},

		leave: function(oncomplete) {

			oncomplete(true);

		}

	};


	return Composite;

});

