
lychee.define('app.plugin.Reddit').requires([
	'app.Scraper'
]).exports(function(lychee, global, attachments) {

	const _SCRAPER = lychee.import('app.Scraper');



	/*
	 * HELPERS
	 */

	const _scrape_subreddit = function(url, oncomplete) {

		let tmp  = url.split('/');
		let subr = tmp[1];


		_SCRAPER.scrape({
			url:  'https://www.reddit.com/r/' + subr + '.json',
			type: 'json'
		}, (data) => {
			oncomplete(data);
		});

	};

	const _scrape_user = function(url, oncomplete) {

		let tmp  = url.split('/');
		let user = tmp[1];


		_SCRAPER.scrape({
			url:  'https://www.reddit.com/user/' + user + '/submitted.json',
			type: 'json'
		}, (data) => {
			oncomplete(data);
		});

	};



	/*
	 * IMPLEMENTATION
	 */

	let Module = {

		can: function(url) {

			// TODO: reddit.com/r/programming
			// TODO: reddit.com/r/programming/comments/id/title
			// TODO: reddit.com/u/username
			// TODO: reddit.com/user/username

			if (url.substr(0, 8) === 'https://') {
				url = url.substr(8);
			} else if (url.substr(0, 7) === 'http://') {
				url = url.substr(7);
			}


			if (url.substr(0, 11) === 'reddit.com/') {

				url = url.substr(11);


				if (/^r\//g.test(url)) {

					return true;

				} else if (/^(u|user)\//g.test(url)) {

					return true;

				}

			}


			return false;

		},

		scrape: function(url, oncomplete) {

			if (url.substr(0, 8) === 'https://') {
				url = url.substr(8);
			} else if (url.substr(0, 7) === 'http://') {
				url = url.substr(7);
			}


			if (url.substr(0, 11) === 'reddit.com/') {

				url = url.substr(11);


				if (/^r\//g.test(url)) {

					_scrape_subreddit(url, oncomplete);

				} else if (/^(u|user)\//g.test(url)) {

					_scrape_user(url, oncomplete);

				}

			}

		},




		process: function(remote, headers) {

			console.log('Reddit plugin', headers);


			remote.sendJSON({
				fuck: 'firefox you shithead'
			});

			if (/imgur\.com\/gallery\//g.test(headers.url)) {

				_process_album(remote, headers);

				return true;

			} else if (/imgur\.com\/a\//g.test(headers.url)) {

				_process_album(remote, headers);

				return true;

			} else if (/i\.imgur\.com\//g.test(headers.url)) {

				_process_image(remote, headers);

				return true;

			}


			return false;

		}

	};


	return Module;

});

