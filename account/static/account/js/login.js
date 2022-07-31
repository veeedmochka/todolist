$('form').submit(function (event) {
	$('form button').blur()
	$('#empty-errors p').text('')
	if ($('form input[name=password]').val() === '' || $('form input[name=username]').val() === '') {
		event.preventDefault()
		if ($('#login-errors').html()) {
			$('#login-errors').fadeOut(300, function () {
				$('#empty-errors p').text('Заполните все поля.')
				$('#empty-errors').fadeIn(300)
			})
		} else {
			$('#empty-errors p').text('Заполните все поля.')
			$('#empty-errors').fadeIn(400)
		}
	}
})


$('form input[name=password]').keyup(function () {
	if ($('form input[name=username]').val() !== '') {
		$('#empty-errors').fadeOut(400)
	}
})


$('form input[name=username]').keyup(function () {
	if ($('form input[name=password]').val() !== '') {
		$('#empty-errors').fadeOut(400)
	}
})


$('#login-errors').fadeIn(400)