
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
			data['constructor'] = 'app.state.Browse';


			return data;

		},

		deserialize: function(blob) {

			_State.prototype.deserialize.call(this, blob);

		},

		enter: function(oncomplete) {

			let client = this.client;
			if (client !== null) {

				let service = client.getService('control');
				if (service !== null) {
					service.bind('browse', _on_browse, this);
				}

				let url = _INPUTS.url;
				if (url !== null) {
					url.bind('change', _on_change, this);
				}

			}


			oncomplete(true);

		},

		leave: function(oncomplete) {

			let client = this.client;
			if (client !== null) {

				let url = _INPUTS.url;
				if (url !== null) {
					url.unbind('change', _on_change, this);
				}

				let service = client.getService('control');
				if (service !== null) {
					service.unbind('browse', _on_browse, this);
				}

			}


			oncomplete(true);

		}

	};


	return Composite;

});
