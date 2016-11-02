
lychee.define('app.net.scraper.Reddit').exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	const _transform = function(raw) {

		let data = [];

		if (raw instanceof Object) {

			if (raw.data instanceof Object && raw.data.children instanceof Array) {

				raw.data.children.forEach(function(post) {

					let code = [];
					let type = 'link';

					if (post.data.selftext !== '') {
						type = 'article';
					}


					if (type === 'link') {

						code.push('### ' + post.data.title);
						code.push('**author**: [' + post.data.author + '](reddit.com/u/' + post.data.author + ')');
						code.push('[' + post.data.url + '](' + post.data.url + ')');

					} else if (type === 'article') {

						code.push('### ' + post.data.title);
						code.push('**author**: [' + post.data.author + '](reddit.com/u/' + post.data.author + ')');
						code.push(post.data.selftext);

					}

					data.push(code.join('\n'));

				});

			}

		}


		return data;

	};

	// r/<subreddit>
	const _scrape_subreddit = function(url, oncomplete) {

		let tmp  = url.split('/');
		let subr = tmp[1];


		this.scraper.request({
			url:  'https://www.reddit.com/r/' + subr + '.json',
			type: 'json'
		}, function(raw) {

			oncomplete(_transform(raw));

		});

	};

	// u/<user>
	const _scrape_user = function(url, oncomplete) {

		let tmp  = url.split('/');
		let user = tmp[1];


		this.scraper.request({
			url:  'https://www.reddit.com/user/' + user + '/submitted.json',
			type: 'json'
		}, function(raw) {

			oncomplete(_transform(raw));

		});

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

			// TODO: reddit.com/r/programming/comments/id/title

			if (url.substr(0, 8) === 'https://') {
				url = url.substr(8);
			} else if (url.substr(0, 7) === 'http://') {
				url = url.substr(7);
			}

			console.log(url);

			if (url.substr(0, 11) === 'reddit.com/') {

				url = url.substr(11);


				if (/^r\//g.test(url)) {

					return true;

				} else if (/^(u|user)\//g.test(url)) {

					return true;

				}

			} else if (url.substr(0, 3) === '/r/') {

				return true;

			} else if (url.substr(0, 3) === '/u/') {

				return true;

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

			} else if (url.substr(0, 3) === '/r/') {

				_scrape_subreddit.call(this, url.substr(1), oncomplete);

			} else if (url.substr(0, 3) === '/u/') {

				_scrape_user.call(this, url.substr(1), oncomplete);

			}

		}

	};


	return Composite;

});

