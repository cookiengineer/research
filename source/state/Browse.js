
lychee.define('app.state.Browse').includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _State   = lychee.import('lychee.app.State');
	const _STATE   = $.state('browse', attachments["html"], attachments["css"]);
	const _ARTICLE = _STATE.query('article');
	const _INPUT   = _STATE.query('header input');



	/*
	 * HELPERS
	 */

	const _on_browse = function(data) {

		console.log('BROWSE', data);

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

		update: function(data) {

			console.log('update with data', data);

		},

		enter: function(oncomplete, data) {

			_STATE.enter();
			_INPUT.value(data.sentence);
			_INPUT.bind('change', this.main.command, this.main);


			let client = this.client;
			if (client !== null) {

				let service = client.getService('control');
				if (service !== null) {
					service.bind('browse', _on_browse, this);
				}

			}


			_State.prototype.enter.call(this, oncomplete);

		},

		leave: function(oncomplete) {

			_INPUT.unbind('change');
			_INPUT.value('');
			_STATE.leave();


			let client = this.client;
			if (client !== null) {

				let service = client.getService('control');
				if (service !== null) {
					service.unbind('browse', _on_browse, this);
				}

			}


			_State.prototype.leave.call(this, oncomplete);

		}

	};


	return Composite;

});
