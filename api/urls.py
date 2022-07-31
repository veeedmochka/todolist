from django.urls import path

from .views import *


urlpatterns = [
	path('list/', TodoListCreate.as_view(), name='api-list-create'),
	path('list/<int:pk>/', TodoListDetail.as_view(), name='api-list'),
	path('list/get-ids/', GetTodoLists.as_view(), name='api-get-lists'),
	path('list/<int:pk>/delete-task/', DeleteTask.as_view(), name='api-delete-task'),
	path('list/<int:pk>/add-task/', AddTask.as_view(), name='api-add-task'),
	path('list/<int:pk>/update-task/', UpdateTask.as_view(), name='api-update-task'),
	path('account/check-username/', CheckUsername.as_view(), name='api-check-username'),
	path('account/check-password/', CheckPassword.as_view(), name='api-check-password'),
	path('account/check-email/', CheckEmail.as_view(), name='api-check-email'),
]
