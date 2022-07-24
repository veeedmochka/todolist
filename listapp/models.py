from django.db import models
from django.conf import settings


class TodoList(models.Model):
	name = models.CharField(max_length=100, verbose_name='Название', default='Новый список')
	tasks = models.JSONField(default=dict(tasks = []), verbose_name='Список задач')
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='Пользователь')

	class Meta:
		verbose_name = 'Списк задач'
		verbose_name_plural = 'Списки задач'

	def __str__(self):
		return f"{name} ({self.user.username}'s list)"

