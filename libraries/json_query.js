
JSON.query = function(object, query) {

	let pointer = null;

	if (object instanceof Object) {

		let tmp = query.split('>').map(v => v.trim());
		if (tmp.length > 0) {

			pointer = object;

			for (let t = 0, tl = tmp.length; t < tl; t++) {

				let link = tmp[t];
				if (pointer[link] !== undefined) {
					pointer = pointer[link];
				} else {
					pointer = null;
				}

			}

		} else {

			pointer = object;

		}

	}

	return pointer;

};

