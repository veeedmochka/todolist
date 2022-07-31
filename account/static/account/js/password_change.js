$('form').submit(function (event) {
	$('form button').blur()
	$('#empty-errors p').text('')

	if ($('form input[name=new_password1]').val() === '' || $('form input[name=old_password]').val() === '' ||
		$('form input[name=new_password2]').val() === '' ) {
		event.preventDefault()
		if ($('#password-change-errors').html()) {
			$('#password-change-errors').fadeOut(300, function () {
				$('#empty-errors p').text('Заполните все поля.')
				$('#empty-errors').fadeIn(300)
			})
		} else {
			$('#empty-errors p').text('Заполните все поля.')
			$('#empty-errors').fadeIn(300)
		}
	} else if ($('#error-new_password2 p').text() !== '' || $('#error-old_password p').text() !== '' || $('#error-new_password1 p').text() !== '') {
		event.preventDefault()
	}
})


// валидация паролей
$('input[name=new_password1], input[name=new_password2]').keyup(function () {
	if ($('input[name=new_password1]') !== '') {
		const password1 = $('input[name=new_password1]').val()
		const password2 = $('input[name=new_password2]').val()
		$.ajax({
			url: '/api/v1/account/check-password/',
			data: {
				'password1': password1,
				'password2': password2,
			},
			success: function (response) {
				if (response['message1']) {
					$('#error-new_password1 p').text(response['message1'])
					$('#error-new_password1').fadeIn(200)
				} else {
					$('#error-new_password1').fadeOut(200)
					$('#error-new_password1 p').text('')
				}
				if (response['message2']) {
					$('#error-new_password2 p').text(response['message2'])
					$('#error-new_password2').fadeIn(200)
				} else {
					$('#error-new_password2').fadeOut(200)
					$('#error-new_password2 p').text('')
				}
			}
		})
	} else {
		$('#error-new_password1').fadeOut(200)
		$('#error-new_password1 p').text('')
		$('#error-new_password2').fadeOut(200)
		$('#error-new_password2 p').text('')
	}
})


$('form input[name=new_password1]').keyup(function () {
	if ($('form input[name=old_password]').val() !== '' && $('form input[name=new_password2]').val() !== '') {
		$('#empty-errors').fadeOut(400)
	}
})


$('form input[name=new_password2]').keyup(function () {
	if ($('form input[name=old_password]').val() !== '' && $('form input[name=new_password1]').val() !== '') {
		$('#empty-errors').fadeOut(400)
	}
})


$('form input[name=old_password]').keyup(function () {
	$('#password-change-errors').fadeOut(400)
	if ($('form input[name=new_password2]').val() !== '' && $('form input[name=new_password1]').val() !== '') {
		$('#empty-errors').fadeOut(400)
	}
})


// Основные ошибки с сервера
$('#password-change-errors').fadeIn(400)