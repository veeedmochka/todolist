from django.contrib import admin

from .models import TodoList, Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
	list_display = ('title', 'content', 'todo_list')


@admin.register(TodoList)
class TodoListAdmin(admin.ModelAdmin):
	list_display = ('__str__', 'task_order', 'user')
