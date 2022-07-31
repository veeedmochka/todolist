from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin

from .models import TodoList


class TodoListView(LoginRequiredMixin, TemplateView):
	template_name = 'listapp/home.html'

	def get_context_data(self, *args, **kwargs):
		context = super().get_context_data(*args, **kwargs)

		# получаем id последнего открывавшегося списка из cookie
		last_list_id = str(self.request.COOKIES.get('last_list_id', None))
		# получаем максимальную длину имени списка
		name_max_length = TodoList._meta.get_field('name').max_length

		context.update({
			'last_list_id': last_list_id,
			'name_max_length': name_max_length
		})

		return context
