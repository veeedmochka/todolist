from rest_framework import serializers

from listapp.models import TodoList


class TodoListSerializer(serializers.ModelSerializer):

	class Meta:
		model = TodoList
		fields = ('pk', 'name', 'tasks')


class TodoListCreateSerializer(serializers.ModelSerializer):
	user = serializers.HiddenField(default=serializers.CurrentUserDefault())

	class Meta:
		model = TodoList
		fields = ('pk', 'name', 'user')