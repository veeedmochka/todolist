from django.views.generic import TemplateView


class TodoListView(TemplateView):
	template_name = 'listapp/home.html'

	def get_context_data(self, *args, **kwargs):
		context = super().get_context_data(*args, **kwargs)

		last_list_id = self.request.COOKIES.get('last_list_id', None)
		context.update({
			'last_list_id': last_list_id
		})

		return context
