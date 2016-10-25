
(function(global) {

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

				win.on('minimize', (e) => state = 'minimize');
				win.on('restore',  (e) => state = 'normal');

				buttons.minimize.onclick = (e) => {
					win.minimize();
				};

			}

			if (buttons.maximize !== null) {

				win.on('maximize', (e) => state = 'maximize');

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

			global.addEventListener('focus', (e) => {
				header.className = 'active';
			});

			global.addEventListener('blur', (e) => {
				header.className = 'inactive';
			});

		}


		let states = [].slice.call(document.querySelectorAll('menu#wm-appstate li'));
		if (states.length > 0) {

			states.forEach(state => {

				state.onclick = function(e) {

					let main = global.MAIN || null;
					let id   = this.innerHTML.toLowerCase();
					if (main !== null) {

						let result = main.changeState(id);
						if (result === true) {
							states.forEach(other => other.className = other === this ? 'active' : 'inactive');
						}

					}

				};

			});

		}

	});

})(typeof window !== 'undefined' ? window : global);

