from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from listapp.models import TodoList
from .serializers import TodoListSerializer, TodoListCreateSerializer
from .permissions import IsOwner


class TodoListDetail(generics.RetrieveUpdateDestroyAPIView):
	"""Получение, обновление и удаление списка"""
	queryset = TodoList.objects.all()
	serializer_class = TodoListSerializer
	permission_classes = [IsAuthenticated, IsOwner]


class TodoListCreate(generics.CreateAPIView):
	"""Создание нового списка"""
	queryset = TodoList.objects.all()
	serializer_class = TodoListCreateSerializer
	permission_classes = [IsAuthenticated]


class GetTodoLists(APIView):
	"""Получение id списков пользователей"""
	permission_classes = [IsAuthenticated]

	def get(self, request):
		lists = TodoList.objects.filter(user__id=request.user.pk)

		return Response({todolist.pk: todolist.name for todolist in lists})


class DeleteTask(APIView):
	permission_classes = [IsAuthenticated, IsOwner]

	def delete(self, request, pk):
		task_id = request.GET.get('task_id', None)
		if task_id and pk:
			todolist = TodoList.objects.get(pk=pk)
			del todolist.tasks['tasks'][task_id]
			todolist.save()
			response = TodoListSerializer(todolist)
			return Response(response.data)
		else:
			return Response({'error': 'No pk'})


class AddTask(APIView):
	permission_classes = [IsAuthenticated, IsOwner]

	def post(self, request, pk):
		todolist = TodoList.objects.get(pk=pk)
		title = request.GET.get('title', None)
		comment = request.GET.get('comment', '')
		if title:
			keys = list(todolist.tasks['tasks'].keys())
			if len(keys) == 0:
				key = "0"
			else:
				key = str(int(keys[-1]) + 1)
			todolist.tasks['tasks'].update({key: [title, comment]})
			todolist.save()
			response = {'task_id': key, 'title': title, 'comment': comment}
			return Response(response)
		else:
			return Response({'error': 'No message'})
