# Generated by Django 4.0.6 on 2022-07-23 23:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('listapp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todolist',
            name='task_order',
            field=models.JSONField(default={'task_order': []}, verbose_name='Порядок задач в списке'),
        ),
    ]
