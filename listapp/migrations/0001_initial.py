# Generated by Django 4.0.6 on 2022-07-23 23:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='TodoList',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('task_order', models.JSONField(default=dict, verbose_name='Порядок задач в списке')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Списк задач',
                'verbose_name_plural': 'Списки задач',
            },
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=250, verbose_name='Заголовок')),
                ('content', models.TextField(blank=True, null=True, verbose_name='Контент')),
                ('todo_list', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='listapp.todolist', verbose_name='Список')),
            ],
            options={
                'verbose_name': 'Задча',
                'verbose_name_plural': 'Задачи',
            },
        ),
    ]