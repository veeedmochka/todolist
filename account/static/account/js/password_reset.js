$('form').submit(function (event) {
	$('form button').blur()
	$('#empty-errors p').text('')

	if ($('form input[name=email]').val() === '') {
		event.preventDefault()
		if ($('#password-reset-errors').html()) {
			$('#password-reset-errors').fadeOut(300, function () {
				$('#empty-errors p').text('Заполните полe.')
				$('#empty-errors').fadeIn(300)
			})
		} else {
			$('#empty-errors p').text('Заполните полe.')
			$('#empty-errors').fadeIn(300)
		}
	}
})


$('form input[name=email]').keyup(function () {
	$('#password-reset-errors').fadeOut(400)
	$('#empty-errors').fadeOut(400)
})


$('#password-reset-errors').fadeIn(400)