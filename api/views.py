from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

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
    """Удаление задачи"""
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
    """Добавление новой задачи"""
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


class UpdateTask(APIView):
    """Редактирование задачи"""
    permission_classes = [IsAuthenticated, IsOwner]

    def patch(self, request, pk):
        todolist = TodoList.objects.get(pk=pk)
        task_id = request.data.get('task_id', None)[8:]
        title = request.data.get('title', None)
        comment = request.data.get('comment', None)

        # Если не передали ни названия, ни комментария
        if not (title or comment):
            return Response({'error': 'No title and comment'})

        print(title, comment)

        tasks = todolist.tasks['tasks']
        if title and comment:
            tasks[task_id] = [title, comment]
        elif comment:
            if comment == '_empty_':
                comment = ''
            tasks[task_id][1] = comment
        elif title:
            tasks[task_id][0] = title
        todolist.save()
        return Response({
            'task_id': task_id,
            'title': tasks[task_id][0],
            'comment': tasks[task_id][1]
        })


class CheckUsername(APIView):

    def get(self, request):
        username = request.GET.get('username', None)
        if username:
            if User.objects.filter(username=username).exists():
                return Response({
                    'exist': True,
                    'message': 'Уже используется.'
                })
            elif len(username) < 4:
                return Response({
                    'exist': False,
                    'message': 'Слишком короткое.'
                })
            else:
                import re
                match = re.search(r'^[a-z0-9][a-z0-9-]+$', username)
                message = 'Может содержать только цифры и латиницу.' if not match else ''
                return Response({
                    'exist': False,
                    'message': message
                })
        else:
            return Response({'error': 'No username'})


class CheckPassword(APIView):
    """Валидация паролей"""

    def get(self, request):
        password1 = request.GET.get('password1', None)
        password2 = request.GET.get('password2', None)

        response = {
            'equal': None,
            'message1': '',
            'message2': '',
        }

        if password1:
            if len(password1) < 6:
                response['message1'] = 'Слишком короткий (минимум 6 символов).'
        if password1 and password2:
            if password1 == password2:
                response['equal'] = True
            else:
                response['equal'] = False
                response['message2'] = 'Пароли не совпадают.'
        elif not (password1 or password2):
            response = {
                'error': 'No passwords'
            }
        return Response(response)


class CheckEmail(APIView):
    """Валидация email"""

    def get(self, request):
        email = request.GET.get('email', None)
        if User.objects.filter(email=email).exists():
            return Response({
                'is_valid': False,
                'message': 'Уже используется.'
            })
        return Response({'is_valid': custom_validate_email(email)})


def custom_validate_email(email):
    from django.core.validators import validate_email
    from django.core.exceptions import ValidationError

    try:
        validate_email(email)
        return True
    except ValidationError:
        return False
