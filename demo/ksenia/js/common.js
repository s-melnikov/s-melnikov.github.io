$(function() {

	$('#search').on('blur', function() {
		$(this)[$(this).val() ? 'addClass' : 'removeClass']('not-empty');
	});

});