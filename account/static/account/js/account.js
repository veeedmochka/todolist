const username = $('input[name=username]').val()
const email = $('input[name=email]').val()

$('form').submit(function (event) {
	$('form button').blur()
	$('#empty-errors p').text('')
	const new_username = $('input[name=username]').val()
	const new_email = $('input[name=email]').val()
	if ($('form input[name=username]').val() === '' || $('form input[name=email]').val() === '') {
		event.preventDefault()
		$('#empty-errors p').text('Заполните все поля.')
		$('#empty-errors').fadeIn(400)
	} else if (new_username === username && new_email === email) {
		event.preventDefault()
		$('#empty-errors p').text('Вы ничего не изменили.')
		$('#empty-errors').fadeIn(400)
	} else if ($('#error-email p').text() !== '' || $('#error-username p').text() !== '' ) {
		event.preventDefault()
	}
})


// валидация имени пользователя
$('input[name=username]').keyup(function () {
	const new_username = $(this).val()
	if (new_username !== '' && new_username !== username) {
		$.ajax({
			url: '/api/v1/account/check-username/',
			data: {
				'username': new_username
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


$('form input[name=email]').keyup(function () {
	const new_email = $('input[name=email]').val()
	if (new_email !== '' && new_email !== email) {
		$.ajax({
			url: '/api/v1/account/check-email/',
			data: {
				'email': new_email
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


$('form input[name=email]').keyup(function () {
	if ($('form input[name=username]').val() !== '') {
		$('#empty-errors').fadeOut(400)
	}
})


$('form input[name=username]').keyup(function () {
	if ($('form input[name=email]').val() !== '') {
		$('#empty-errors').fadeOut(400)
	}
})
