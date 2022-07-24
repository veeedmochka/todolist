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
	permission_classes = (IsOwner|IsAdminUser, )


class TodoListCreate(generics.CreateAPIView):
	"""Создание нового списка"""
	queryset = TodoList.objects.all()
	serializer_class = TodoListCreateSerializer
	permission_classes = (IsAuthenticated, )


class GetTodoLists(APIView):
	"""Получение id списков пользователей"""
	permission_classes = (IsAuthenticated, )

	def get(self, request):
		lists = TodoList.objects.filter(user__id=request.user.pk)

		return Response({todolist.pk: todolist.name for todolist in lists})
