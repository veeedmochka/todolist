let lists_pks = []
let default_list_pk = 0  	// id текущего списка
let tasks = []
const time_pre_load = 140


function get_tasks() {
	$.ajax({
		url: 'api/v1/list/' + default_list_pk + '/',
		success: function(response) {
			const tasks = response['tasks']['tasks']
			$('#list-name-main').text(response['name'])
			$('#list-name').text(response['name'])
			if (Object.keys(tasks).length == 0) {
				$('#tasks').append('<small class="text-muted text-center">(Пока пусто)</small>')
			}
			else {
				Object.keys(tasks).forEach(key => {
					$('#tasks').append(
						'<a id="task-id-' + key + '" href="#" class="list-group-item list-group-item-action">' +
	                	'<div class="d-flex flex-row align-items-center w-100 justify-content-between">' +
	                    '<div><p class="mb-0 fs-5" style="padding-right: 10px;">' + tasks[key][0] + '</p>' +
	                    '<small class="text-muted">' + tasks[key][1] + '</small></div>' +
	                    '<div><input id="box-id-' + key + '" class="form-check-input m-0" type="checkbox" style="width: 25px; height: 25px;"></div>' +
	                	'</div></a>'
					)
				})
			}

			$('#pre-load-list-name').fadeOut(time_pre_load, function() {
				$('#list-name').fadeIn(time_pre_load)
			})
			$('#pre-load').fadeOut(time_pre_load, function () {
				$('#main-container').fadeIn(time_pre_load)
				$('#tasks').fadeIn(time_pre_load)
				$('#add-task').fadeIn(time_pre_load)
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


// Получениие списков
$.ajax({
	url: 'api/v1/list/get-ids/',
	success: function(response) {
		lists_pks = Object.keys(response)
		// если в куки есть id последнего списка
		if (last_list_id) {
			default_list_pk = last_list_id
		} else {
			default_list_pk = lists_pks[0]
			document.cookie = "last_list_id=" + default_list_pk
		}
		$(document).prop('title', 'Todo List: ' + response[default_list_pk]);
		lists_pks.forEach(key => {
			if (key != default_list_pk) {
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
	pre_load()

	$('#list-id-' + default_list_pk).css('display', 'inline-block')
	$('#' + $(this).attr('id')).css('display', 'none')
	$(document).prop('title', 'Todo List: ' + $('#' + $(this).attr('id')).text());

	default_list_pk = $(this).attr('id').slice(8)
	document.cookie = "last_list_id=" + default_list_pk

	get_tasks()
})


// удаление задачи
$('#tasks').on('click', 'input[type="checkbox"]', function (event) {
	const box_id = $(this).attr('id').slice(7)
	console.log(box_id, )
	$.ajax({
		url: '/api/v1/list/' + default_list_pk + '/delete-task/?task_id=' + box_id,
		method: 'DELETE',
		headers: {
			'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
		},
		success: function (response) {
			$('#task-id-' + box_id).fadeOut(200, function () {
				$(this).remove()
				if ($('#tasks').children().length == 0) {
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


// кнопка добавить
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
				$('#tasks small').remove()	// удаляет надпись (Пока пусто)
				$('#tasks').append(
					'<a id="task-id-' + response['task_id'] + '" href="#" class="list-group-item list-group-item-action">' +
	            	'<div class="d-flex flex-row align-items-center w-100 justify-content-between">' +
	                '<div><p class="mb-0 fs-5" style="padding-right: 10px;">' + response['title'] + '</p>' +
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