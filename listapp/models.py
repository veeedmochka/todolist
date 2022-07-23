from django.db import models
from django.conf import settings


class TodoList(models.Model):
	task_order = models.JSONField(default=dict(task_order = []), verbose_name='Порядок задач в списке')
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='Пользователь')

	class Meta:
		verbose_name = 'Списк задач'
		verbose_name_plural = 'Списки задач'

	def __str__(self):
		return f"{self.user.username}'s list"


class Task(models.Model):
	title = models.CharField(max_length=250, verbose_name='Заголовок')
	content = models.TextField(null=True, blank=True, verbose_name='Контент')
	todo_list = models.ForeignKey(TodoList, on_delete=models.CASCADE, verbose_name='Список')
	
	class Meta:
		verbose_name = 'Задча'
		verbose_name_plural = 'Задачи'

	def __str__(self):
		return self.title

	def get_absolute_url(self):
		return reverse('task', kwargs={'pk': self.pk})
