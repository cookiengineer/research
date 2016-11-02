
lychee.define('app.state.Browse').includes([
	'lychee.app.State',
	'lychee.event.Emitter'
]).exports(function(lychee, global, attachments) {

	const _Emitter = lychee.import('lychee.event.Emitter');
	const _State   = lychee.import('lychee.app.State');
	const _INPUTS  = {
		url:    $.input('#browse-url'),
		images: $.input('#browse-images'),
		videos: $.input('#browse-videos'),
		edit:   $.input('#browse-edit'),
		reload: $.input('#browse-reload'),
		tags:   $.input('#browse-tags'),
		save:   $.input('#browse-save')
	};


	global.__INPUTS = _INPUTS;


	/*
	 * HELPERS
	 */

	const _on_browse = function(data) {

		console.log('BROWSE', data);

	};

	const _on_change = function(url) {

		let images  = _INPUTS.images.getValue();
		let videos  = _INPUTS.videos.getValue();
		let service = this.client.getService('control');

console.log(service, url, images, videos);

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
		_Emitter.call(this);



		/*
		 * INITIALIZATION
		 */

		this.bind('change', function(url) {

			console.log('TAB CHANGE', url);

		}, this);

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
