from django.urls import path

from .views import TodoListDetail, GetTodoLists, TodoListCreate


urlpatterns = [
	path('list/', TodoListCreate.as_view(), name='api-list-create'),
	path('list/<int:pk>/', TodoListDetail.as_view(), name='api-list'),
	path('list/get-ids/', GetTodoLists.as_view(), name='api-get-lists'),
]