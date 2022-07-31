$('form').submit(function (event) {
	$('form button').blur()
	$('#empty-errors p').text('')
	if ($('form input[name=password1]').val() === '' || $('form input[name=username]').val() === '' ||
		$('form input[name=password2]').val() === '' || $('form input[name=email]').val() === '') {
		event.preventDefault()
		$('#empty-errors p').text('Заполните все поля.')
		$('#empty-errors').fadeIn(400)
	} else if ($('#error-password2 p').text() !== '' || $('#error-username p').text() !== '' ||
		$('#error-password1 p').text() !== '' || $('#error-email p').text() !== '') {
		event.preventDefault()
	}
})


// валидация имени пользователя
$('input[name=username]').keyup(function () {
	if ($(this).val() !== '') {
		const username = $(this).val()
		$.ajax({
			url: '/api/v1/account/check-username/',
			data: {
				'username': username
			},
			success: function (response) {
				if (response['message']) {
					$('#error-username p').text(response['message'])
					$('#error-username').fadeIn(200)
				} else {
					$('#error-username').fadeOut(200)
					$('#error-username p').text('')
				}
			}
		})
	} else {
		$('#error-username').fadeOut(200)
		$('#error-username p').text('')
	}
})


// валидация паролей
$('input[name=password1], input[name=password2]').keyup(function () {
	if ($('input[name=password1]') !== '') {
		const password1 = $('input[name=password1]').val()
		const password2 = $('input[name=password2]').val()
		$.ajax({
			url: '/api/v1/account/check-password/',
			data: {
				'password1': password1,
				'password2': password2,
			},
			success: function (response) {
				if (response['message1']) {
					$('#error-password1 p').text(response['message1'])
					$('#error-password1').fadeIn(200)
				} else {
					$('#error-password1').fadeOut(200)
					$('#error-password1 p').text('')
				}
				if (response['message2']) {
					$('#error-password2 p').text(response['message2'])
					$('#error-password2').fadeIn(200)
				} else {
					$('#error-password2').fadeOut(200)
					$('#error-password2 p').text('')
				}
			}
		})
	} else {
		$('#error-password1').fadeOut(200)
		$('#error-password1 p').text('')
		$('#error-password2').fadeOut(200)
		$('#error-password2 p').text('')
	}
})


$('form input[name=email]').keyup(function () {
	const email_val = $('input[name=email]').val()
	if (email_val !== '') {
		$.ajax({
			url: '/api/v1/account/check-email/',
			data: {
				'email': email_val
			},
			success: function (response) {
				if (response['is_valid']) {
					$('#error-email').fadeOut(200)
					$('#error-email p').text('')
				} else if (response['message']) {
					$('#error-email p').text(response['message'])
					$('#error-email').fadeIn(200)
				} else {
					$('#error-email p').text('Введите правильный адрес электронной почты.')
					$('#error-email').fadeIn(200)
				}
			}
		})
	} else {
		$('#error-email').fadeOut(200)
		$('#error-email p').text('')
	}
})


$('form input[name=password1]').keyup(function () {
	if ($('form input[name=username]').val() !== '' && $('form input[name=password2]').val() !== '' &&
		$('form input[name=email]').val() !== '') {
		$('#empty-errors').fadeOut(400)
	}
})


$('form input[name=password2]').keyup(function () {
	if ($('form input[name=username]').val() !== '' && $('form input[name=password1]').val() !== '' &&
		$('form input[name=email]').val() !== '') {
		$('#empty-errors').fadeOut(400)
	}
})


$('form input[name=username]').keyup(function () {
	if ($('form input[name=password2]').val() !== '' && $('form input[name=password1]').val() !== '' &&
		$('form input[name=email]').val() !== '') {
		$('#empty-errors').fadeOut(400)
	}
})


$('form input[name=email]').keyup(function () {
	if ($('form input[name=password2]').val() !== '' && $('form input[name=password1]').val() !== '' &&
		$('form input[name=username]').val() !== '') {
		$('#empty-errors').fadeOut(400)
	}
})