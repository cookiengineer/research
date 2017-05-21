
(function(global) {

	/*
	 * HISTORY API
	 */

	const _set_active_tab = function(tab) {

		let history = document.querySelector('header#wm #wm-center');
		if (history !== null) {

			Array.from(history.querySelectorAll('ul.wm-history')).forEach(function(list) {

				Array.from(list.querySelectorAll('li')).forEach(function(other) {
					other.className = other === tab.element ? 'active' : '';
				});

			});

		}

	};

	const _Tab = function(state, data) {

		let tab = document.createElement('li');
		let img = document.createElement('img');

		// TODO: Favicon support!?
		img.src = '/design/icon.png';
		tab.title = 'State: ' + state;

		tab.onclick = function() {

			let main = global.MAIN;
			if (main.state !== main.__states[state]) {
				main.changeState(state, data, true);
			}

			_set_active_tab(this);

		}.bind(this);

		tab.appendChild(img);


		this.element = tab;

	};

	const _History = function() {

		let list = document.createElement('ul');
		list.className = 'wm-history';


		let history = document.querySelector('header#wm #wm-center');
		if (history !== null) {
			history.appendChild(list);
		}

		this.element = list;
		this.tabs    = [];

	};

	_History.prototype = {

		add: function(tab) {

			tab = tab instanceof _Tab ? tab : null;

			if (tab !== null) {

				if (this.tabs.indexOf(tab) === -1) {
					this.element.appendChild(tab.element);
					this.tabs.push(tab);
				}

			}

		},

		remove: function(tab) {

			tab = tab instanceof _Tab ? tab : null;

			if (tab !== null) {

				let index = this.tabs.indexOf(tab);
				if (index !== -1) {

					this.element.removeChild(tab.element);
					this.tabs.splice(index, -1);

				}

			}

		}

	};



	/*
	 * OS GUI INTEGRATION
	 */

	global.addEventListener('load', (e) => {

		if (typeof require === 'function') {

			let gui     = require('nw.gui');
			let win     = gui.Window.get();
			let state   = 'normal';
			let buttons = {
				minimize: document.querySelector('#wm-minimize'),
				maximize: document.querySelector('#wm-maximize'),
				close:    document.querySelector('#wm-close')
			};

			if (buttons.minimize !== null) {

				win.on('minimize', (e) => (state = 'minimize'));
				win.on('restore',  (e) => (state = 'normal'));

				buttons.minimize.onclick = (e) => {
					win.minimize();
				};

			}

			if (buttons.maximize !== null) {

				win.on('maximize', (e) => (state = 'maximize'));

				buttons.maximize.onclick = (e) => {

					if (state !== 'maximize') {
						win.maximize();
						state = 'maximize';
					} else if (state === 'maximize') {
						win.unmaximize();
						state = 'normal';
					}

				};

			}

			if (buttons.close !== null) {

				buttons.close.onclick = (e) => {
					win.close();
				};

			}

		}


		let header = document.querySelector('header#wm');
		if (header !== null) {

			global.addEventListener('focus', (e) => (header.className = 'active'));
			global.addEventListener('blur',  (e) => (header.className = 'inactive'));

		}


		let icon = document.querySelector('header#wm #wm-icon');
		if (icon !== null) {

			icon.addEventListener('click', function(e) {

				let main = global.MAIN;
				if (main.state !== main.__states.dialog) {
					main.changeState('dialog');
				}

			}, true);

		}

		let settings = document.querySelector('header#wm #wm-settings');
		if (settings !== null) {

			settings.addEventListener('click', function(e) {

				let main = global.MAIN;
				if (main.state !== main.__states.settings) {
					main.changeState('settings');
				}

			}, true);

		}

	});



	/*
	 * WM API
	 */

	const WM = {

		history: null,
		state:   null,

		changeState: function(state, data) {

			let tab = null;

			if (state === 'dialog') {

				tab = new _Tab(state, data);
				WM.history = new _History();
				WM.history.add(tab);
				WM.state = state;

			} else if (state === 'browse') {

				tab = new _Tab(state, data);
				WM.history.add(tab);
				WM.state = state;

			} else if (state === WM.state || WM.state === 'dialog') {

				tab = new _Tab(state, data);
				WM.history.add(tab);
				WM.state = state;

			} else if (state !== WM.state) {

				tab = new _Tab(state, data);
				WM.history = new _History();
				WM.history.add(tab);
				WM.state = state;

			}


			if (tab !== null) {
				_set_active_tab(tab);
			}

		}

	};


	global.WM = WM;

})(typeof window !== 'undefined' ? window : global);

