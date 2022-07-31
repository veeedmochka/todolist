from django.contrib import admin

from .models import TodoList


@admin.register(TodoList)
class TodoListAdmin(admin.ModelAdmin):
	list_display = ('name', 'user', 'tasks')
