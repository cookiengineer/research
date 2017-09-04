
lychee.define('app.state.Dialog').includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _State     = lychee.import('lychee.app.State');
	const _COMPONENT = Polyfillr.import(attachments["html"].url, attachments["html"].buffer)['state-dialog'];
	const _main      = global.document.querySelector('main');



	/*
	 * HELPERS
	 */

	const _on_change = function(value) {

		let result = this.main.command(value);
		if (result === false) {

			this.element.fireEventListener('error', {
				message: 'Please rephrase command.'
			});

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(main) {

		this.element = _COMPONENT.create();

		this.__listener = null;


		_main.appendChild(this.element);
		_State.call(this, main);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			let data = _State.prototype.serialize.call(this);
			data['constructor'] = 'app.state.Dialog';


			return data;

		},

		update: function(intent) {

			// XXX: Do nothing

		},

		enter: function(oncomplete) {

			this.__listener = function(e) {
				_on_change.call(this, e.detail);
			}.bind(this);

			this.element.fireEventListener('enter', null);
			this.element.addEventListener('command', this.__listener, true);

			_State.prototype.enter.call(this, oncomplete);

		},

		leave: function(oncomplete) {

			this.element.removeEventListener('command', this.__listener, true);
			this.element.fireEventListener('leave', null);

			this.__listener = null;

			_State.prototype.leave.call(this, oncomplete);

		}

	};


	return Composite;

});
