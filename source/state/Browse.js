
lychee.define('app.state.Browse').includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _State  = lychee.import('lychee.app.State');
	const _INPUTS = {
		url: $.input('#browse-input-url'),
		img: $.input('#browse-input-img'),
		vid: $.input('#browse-input-vid')
	};
	const _OUTPUTS = {
		links:  $.output('#browse-links'),
		images: $.output('#browse-images'),
		videos: $.output('#browse-videos')
	};



	/*
	 * HELPERS
	 */

	const _on_change = function(url) {

		let images = _INPUTS.img.getValue();
		let videos = _INPUTS.vid.getValue();
		let plugin = this.main.getPlugin(url);

		if (plugin !== null) {

			plugin.scrape(url, (data) => {
				console.log('scrape complete!', data);
			});

		} else {
			// TODO: Display error message?
		}



		console.log('SURF TURF TO', url, images, videos);


	};



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

			_INPUTS.url.bind('change', _on_change, this);

			oncomplete(true);

		},

		leave: function(oncomplete) {

			_INPUTS.url.unbind('change', _on_change, this);

			oncomplete(true);

		}

	};


	return Composite;

});
