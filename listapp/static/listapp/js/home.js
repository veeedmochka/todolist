let lists_pks = []
let default_list_pk = ''  	// id текущего списка
let tasks = []
const time_pre_load = 0
const time_get_tasks = 120


function get_tasks() {
	$.ajax({
		url: 'api/v1/list/' + default_list_pk + '/',
		success: function(response) {
			const tasks = response['tasks']['tasks']
			$('#list-name-main').text(response['name'])
			$('#list-name').text(response['name'])
			if (Object.keys(tasks).length === 0) {
				$('#tasks').append('<small id="empty" class="text-muted text-center">(Пока пусто)</small>')
			}
			else {
				Object.keys(tasks).forEach(key => {
					$('#tasks').append(
						'<a id="task-id-' + key + '" class="task list-group-item list-group-item-action p-0" title="Нажми, чтобы изменить">' +
	                	'<div class="d-flex flex-row align-items-center w-100 justify-content-between p-3 pt-0 pb-0">' +
	                    '<div data-bs-toggle="modal" data-bs-target="#updateTaskModal" class="pt-2 pb-2 w-100"><p class="mb-0 fs-5" style="padding-right: 10px;">' + tasks[key][0] + '</p>' +
	                    '<small class="text-muted">' + tasks[key][1] + '</small></div>' +
	                    '<div><input id="box-id-' + key + '" class="form-check-input m-0" type="checkbox" title="Выполнено" style="width: 25px; height: 25px;"></div>' +
	                	'</div></a>'
					)
				})
			}

			$('#pre-load-list-name').fadeOut(time_get_tasks, function() {
				$('#list-name').fadeIn(time_get_tasks)
			})
			$('#pre-load').fadeOut(time_get_tasks, function () {
				$('#main-container').fadeIn(time_get_tasks)
				$('#tasks').fadeIn(time_get_tasks)
				$('#add-task').fadeIn(time_get_tasks)
			})
			
		}
	})
}


function pre_load() {
	$('#list-name').fadeOut(time_pre_load, function () {
		$('#pre-load-list-name').fadeIn(time_pre_load)
	})
	$('#main-container').fadeOut(time_pre_load, function () {
		$('#pre-load').fadeIn(time_pre_load)
	})
	$('#tasks').html('').fadeOut()
	$('#add-task').fadeOut()
}

pre_load()


// Получениие списков
$.ajax({
	url: 'api/v1/list/get-ids/',
	success: function(response) {
		lists_pks = Object.keys(response)

		if (lists_pks.length === 0) {
			add_list_div()
		} else {
			// получаем id последнего списка из cookie
			if (last_list_id && (lists_pks.includes(last_list_id.toString()))) {
				default_list_pk = last_list_id.toString()
			} else {
				default_list_pk = lists_pks[0]
			}
			document.cookie = "last_list_id=" + default_list_pk
			// меняем title
			$(document).prop('title', 'Todo List: ' + response[default_list_pk]);
			lists_pks.forEach(key => {
				if (key !== default_list_pk) {
					$('#lists').append(
						'<li><a class="dropdown-item" href id="list-id-' + key + '">' + response[key] + '</a></li>'
					)
				} else {
					$('#lists').append(
						'<li><a class="dropdown-item" href id="list-id-' + key + '" style="display: none;">' + response[key] + '</a></li>'
					)
				}
			})
			get_tasks()
		}

	}
})


function add_list_div() {
	$('#pre-load-list-name').fadeOut(200)
	$('#pre-load').fadeOut(200, function () {
		$('#add-list-div').fadeIn(200)
		setTimeout(function () {
			$('#add-list-div input').focus()
		}, 200)
	})
}


// создание нового списка из add-list-div
$('#add-list-div form').submit(function (event) {
	event.preventDefault()
	name = $('#add-list-div input').val()
	if (name) {
		$.ajax({
			url: '/api/v1/list/',
			method: 'POST',
			data: JSON.stringify({
				"name": name
			}),
			contentType: 'application/json',
			headers: {
				'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
			},
			success: function (response) {
				$('#add-list-div').fadeOut(200, function () {
					pre_load()
					default_list_pk = response["pk"].toString()
					document.cookie = "last_list_id=" + default_list_pk
					lists_pks.push(default_list_pk)
					$('#list-name-main').text(response['name'])
					$('#list-name').text(response['name'])
					$('#lists').append(
						'<li><a class="dropdown-item" href style="display: none" id="list-id-' + default_list_pk + '">' + response['name'] + '</a></li>'
					)
					$(document).prop('title', 'Todo List: ' + response['name'])
					get_tasks()
				})
			}
		})
	}
})


// hover "Добавить задачу"
$('#add-task').hover(function () {
	$('#add-task > img:first').css('display', 'none')
	$('#add-task > img:last').css('display', 'inline-block')
}, function () {
	$('#add-task > img:last').css('display', 'none')
	$('#add-task > img:first').css('display', 'inline-block')
})


// Переключение списка
$('#lists').on('click', '.dropdown-item', function (event) {
	event.preventDefault()
	if ($(this).attr('id') !== 'add-list-btn') {
		pre_load()

		$('#list-id-' + default_list_pk).css('display', 'inline-block')
		$('#' + $(this).attr('id')).css('display', 'none')
		$(document).prop('title', 'Todo List: ' + $('#' + $(this).attr('id')).text());

		default_list_pk = $(this).attr('id').slice(8).toString()
		document.cookie = "last_list_id=" + default_list_pk

		get_tasks()
	}
})


// добавить список
$('#add-list-btn').click(function (event) {
	$('#addListModal input').val('')
	setTimeout(function () {
		$('#addListModal input').focus()
	}, 500)
})
$('#addListModal form').submit(function (event) {
	event.preventDefault()
	name = $('#addListModal input').val()
	$.ajax({
		url: '/api/v1/list/',
		method: 'POST',
		data: JSON.stringify({
			"name": name
		}),
		contentType: 'application/json',
		headers: {
			'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
		},
		success: function (response) {
			pre_load()
			$('#list-id-' + default_list_pk).css('display', 'inline-block')
			default_list_pk = response["pk"].toString()
			document.cookie = "last_list_id=" + default_list_pk
			lists_pks.push(default_list_pk)
			$('#list-name-main').text(response['name'])
			$('#list-name').text(response['name'])
			$('#lists').append(
				'<li><a class="dropdown-item" href style="display: none" id="list-id-' + default_list_pk + '">' + response['name'] + '</a></li>'
			)
			$(document).prop('title', 'Todo List: ' + response['name'])
			get_tasks()
		}
	})
})


// удаление задачи
$('#tasks').on('click', 'input[type="checkbox"]', function (event) {
	const box_id = $(this).attr('id').slice(7)
	$.ajax({
		url: '/api/v1/list/' + default_list_pk + '/delete-task/?task_id=' + box_id,
		method: 'DELETE',
		headers: {
			'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
		},
		success: function (response) {
			$('#task-id-' + box_id).fadeOut(200, function () {
				$(this).remove()
				if ($('#tasks').children().length === 0) {
					$('#tasks').append('<small class="text-muted text-center">(Пока пусто)</small>')
				}
			})
		},
		error: function (response) {
			console.log(response)
		}
	})
})


// добавление задачи
$('.container').on('click', '#add-task', function (event) {
	event.preventDefault()
	$('#add-task').css('display', 'none')
	$('#add-task-inputs input').val('')
	$('#add-task-inputs textarea').val('')
	$('#add-task-inputs').css('display', 'block')
	$('#add-task-inputs input').focus()
})


$('#add-task-inputs textarea').keydown(function (event) {
	if (event['key'] === 'Enter') {
		event.preventDefault()
		$('#add-task-inputs .btn-red').click()
	}
})


// кнопка добавить задачу
$('#add-task-inputs').on('click', '.btn-red', function (event) {
	event.preventDefault()
	$('#add-task').css('display', 'inline-block')
	$('#add-task-inputs').css('display', 'none')
	$.ajax({
		url: '/api/v1/list/' + default_list_pk + '/add-task/?title=' + $('#add-task-inputs input').val() +
		'&comment=' + $('#add-task-inputs textarea').val(),
		method: 'POST',
		headers: {
			'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
		},
		success: function (response) {
			if (!('error' in response)) {
				$('#tasks small#empty').remove()	// удаляет надпись (Пока пусто)
				$('#tasks').append(
					'<a id="task-id-' + response['task_id'] + '" class="task list-group-item list-group-item-action p-0" title="Нажми, чтобы изменить">' +
	            	'<div class="d-flex flex-row align-items-center w-100 justify-content-between p-3 pt-0 pb-0">' +
	                '<div data-bs-toggle="modal" data-bs-target="#updateTaskModal" class="pt-2 pb-2 w-100"><p class="mb-0 fs-5" style="padding-right: 10px;">' + response['title'] + '</p>' +
	                '<small class="text-muted">' + response['comment'] + '</small></div>' +
	                '<div><input id="box-id-' + response['task_id'] + '" class="form-check-input m-0" type="checkbox" style="width: 25px; height: 25px;"></div>' +
	            	'</div></a>'
				)
			}
		}
	})
})


// кнопка отмена
$('#add-task-inputs').on('click', '.btn-outline-cancle', function (event) {
	event.preventDefault()
	$('#add-task').css('display', 'inline-block')
	$('#add-task-inputs').css('display', 'none')
})


// кнопка переименования списка и удаления
$('#change-list-btn').click(function (event) {
	event.preventDefault()
	$('#ChangeListModal input').val($('#list-name-main').text())
	setTimeout(function () {
		$('#ChangeListModal input').focus()
	}, 500)
})


let new_name
// переименование списка
$('#ChangeListModal form').submit(function (event) {
	event.preventDefault()
	new_name = $('#ChangeListModal input').val()
	if ($('#list-name-main').text() != new_name) {
		$.ajax({
			url: '/api/v1/list/' + default_list_pk + '/',
			method: 'PATCH',
			data: JSON.stringify({
				"name": new_name
			}),
			contentType: 'application/json',
			headers: {
				'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
			},
			success: function (response) {
				$('#list-name-main').text(response['name'])
				$('#list-name').text(response['name'])
				$('#list-id-' + default_list_pk).text(response['name'])
				$(document).prop('title', 'Todo List: ' + response['name']);
			}
		})
	}
})


// удалить список
$('#delete-list-btn').click(function (event) {
	$.ajax({
		url: '/api/v1/list/' + default_list_pk + '/',
		method: 'DELETE',
		headers: {
			'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
		},
		success: function (response) {
			// удаляем id из списка
			lists_pks = jQuery.grep(lists_pks, function(value) {
				return value !== default_list_pk;
			});
			$('#list-id-' + default_list_pk).remove()
			if (lists_pks.length !== 0) {
				default_list_pk = lists_pks[0]
				pre_load()
				$('#list-id-' + default_list_pk).css('display', 'none')
				$(document).prop('title', 'Todo List: ' + $('#list-id-' + default_list_pk).text());
				document.cookie = "last_list_id=" + default_list_pk
				get_tasks()
			} else {
				$('#add-list-div input').val('')
				$(document).prop('title', 'Todo List');
				$('#main-container').fadeOut(200, function () {
					$('#add-list-div').fadeIn(200)
				})
				$('#list-name').fadeOut(200)
			}
		}
	})
})

