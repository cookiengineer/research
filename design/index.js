
((global, doc) => {

	const menu  = doc.querySelector('menu');
	const main  = doc.querySelector('main');
	const items = [].slice.call(menu.querySelectorAll('li'));
	const views = [].slice.call(doc.querySelectorAll('main > section'));



	/*
	 * HELPERS
	 */




	/*
	 * INITIALIZATION
	 */

	if (menu !== null && main !== null) {

		if (items.length > 0) {

            items.forEach(item => {

				let name = item.innerText.toLowerCase();
				let view = main.querySelector('#' + name);

				if (view !== null) {

					item.onclick = function() {
						UI.changeView(name);
					};

				}

			});

		}

	}



	// XXX: This is not possible with CSS -_-

	views.forEach(view => {

		let header = view.querySelector('header');
		let aside  = view.querySelector('aside');

		if (header !== null && aside !== null) {
			header.style.right = '254px';
		}

	});



	const UI = {

		changeView: function(id) {

			let curr = items.find(el => el.className === 'active');
			let item = items.find(el => el.innerText.toLowerCase() === id) || null;
			let view = views.find(el => el.id === id) || null;

			if (view !== null) {

				views.forEach(other => other.className = (other === view) ? 'active' : '');
				items.forEach(other => other.className = (other === item) ? 'active' : '');


				let MAIN = global.MAIN || null;
				if (MAIN !== null) {
					MAIN.changeState(id);
				}

			}

		}

	};



	global.UI = UI;

	if (typeof window !== 'undefined') {
		window.UI = UI;
	}

})(typeof global !== 'undefined' ? global : this, document);
