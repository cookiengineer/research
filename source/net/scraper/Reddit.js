
lychee.define('app.net.scraper.Reddit').exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	const _scrape_subreddit = function(url, oncomplete) {

		let tmp  = url.split('/');
		let subr = tmp[1];


		this.scraper.request({
			url:  'https://www.reddit.com/r/' + subr + '.json',
			type: 'json'
		}, (data) => oncomplete(data));

	};

	const _scrape_user = function(url, oncomplete) {

		let tmp  = url.split('/');
		let user = tmp[1];


		this.scraper.request({
			url:  'https://www.reddit.com/user/' + user + '/submitted.json',
			type: 'json'
		}, (data) => oncomplete(data));

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(scraper) {

		this.scraper = scraper;

	};


	Composite.prototype = {

		/*
		 * CUSTOM API
		 */

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

					_scrape_subreddit.call(this, url, oncomplete);

				} else if (/^(u|user)\//g.test(url)) {

					_scrape_user.call(this, url, oncomplete);

				}

			}

		}

	};


	return Composite;

});

