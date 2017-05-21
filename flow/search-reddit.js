
setTimeout(function() {

	let input = $.state('dialog').query('input');

	input.value('search /r/programming for samaritan');

	setTimeout(function() {
		console.log('okay?');
		window.__INPUT = input;
	}, 500);

}, 1000);

