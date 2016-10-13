
((global, doc) => {

	const menu  = doc.querySelector('menu');
	const main  = doc.querySelector('main');
	const views = [].slice.call(doc.querySelectorAll('main > section'));



	/*
	 * HELPERS
	 */




	/*
	 * INITIALIZATION
	 */

	if (menu !== null && main !== null) {

		let items = [].slice.call(menu.querySelectorAll('li'));
		if (items.length > 0) {

            items.forEach(item => {

				let name = item.innerText.toLowerCase();
				let view = main.querySelector('#' + name);

				if (view !== null) {

					item.onclick = function() {

						views.forEach(other => other.className = (other === view) ? 'active' : '');
						items.forEach(other => other.className = (other === item) ? 'active' : '');

					};

				}

			});

		}

	}

})(typeof global !== 'undefined' ? global : this, document);
