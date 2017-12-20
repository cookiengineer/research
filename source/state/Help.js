
lychee.define('app.state.Help').requires([
	'app.interface.Intent'
]).includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _Intent    = lychee.import('app.interface.Intent');
	const _State     = lychee.import('lychee.app.State');
	const _BLOB      = attachments["json"].buffer;
	const _COMPONENT = Polyfillr.import(attachments["html"].url, attachments["html"].buffer)['state-help'];
	const _main      = global.document.querySelector('main');



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(main) {

		this.bot     = main.bot || null;
		this.element = _COMPONENT.create();


		_main.appendChild(this.element);
		_State.call(this, main);

		this.deserialize(_BLOB);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			let data = _State.prototype.serialize.call(this);
			data['constructor'] = 'app.state.Help';


			return data;

		},

		deserialize: function(blob) {

			if (blob.intents instanceof Array) {

				let bot = this.bot || null;
				if (bot !== null) {

					for (let i = 0, il = blob.intents.length; i < il; i++) {
						bot.addIntent(new _Intent(blob.intents[i]));
					}

				}

			}

		},

		enter: function(oncomplete, intent) {

			oncomplete = oncomplete instanceof Function ? oncomplete : null;
			intent     = intent instanceof _Intent      ? intent     : null;


			this.element.fireEventListener('enter', null);


			return _State.prototype.enter.call(this, oncomplete);

		},

		leave: function(oncomplete) {

			oncomplete = oncomplete instanceof Function ? oncomplete : null;


			this.element.fireEventListener('leave', null);


			return _State.prototype.leave.call(this, oncomplete);

		}

	};


	return Composite;

});
