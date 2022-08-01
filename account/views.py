from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth import login, logout
from django.contrib.auth.views import LoginView, PasswordChangeView, PasswordResetView, PasswordResetConfirmView
from django.views.generic import TemplateView
from django.views.generic.edit import FormView
from django.contrib.auth.models import User

from .forms import CustomLoginForm, CustomUserCreationForm, CustomPasswordChangeForm, CustomPasswordResetForm,\
	CustomSetPasswordForm, AccountForm


class AccountView(FormView):
	template_name = 'account/account.html'
	form_class = AccountForm
	success_url = '/account/'

	def get_form(self, form_class=AccountForm):
		if self.request.method == 'POST':
			form = form_class(self.request.POST, instance=User.objects.get(pk=self.request.user.pk))
		else:
			form = form_class(instance=User.objects.get(pk=self.request.user.pk))
		return form

	def form_valid(self, form):
		form.save()
		return super().form_valid(form)


class CustomLoginView(LoginView):
	template_name = 'account/login.html'
	authentication_form = CustomLoginForm

	def get_context_data(self, **kwargs):
		context = super().get_context_data(**kwargs)

		if self.request.method == 'POST':
			form = CustomLoginForm(self.request)
			if not form.is_valid():
				context['error'] = 'Неверный логин или пароль.'
		return context


class SignUpView(FormView):
	template_name = 'account/signup.html'
	form_class = CustomUserCreationForm
	success_url = '/account/login/'

	def form_valid(self, form):
		form.save()
		if self.request.user.is_authenticated:
			logout(self.request)
		return super().form_valid(form)


def log_out(request):
	"""Выход"""
	logout(request)
	return redirect('login')


class CustomPasswordChangeView(PasswordChangeView):
	template_name = 'account/password_change.html'
	form_class = CustomPasswordChangeForm

	def get_context_data(self, **kwargs):
		context = super().get_context_data(**kwargs)

		if self.request.method == 'POST':
			form = CustomLoginForm(self.request)
			if not form.is_valid():
				context['error'] = 'Старый пароль введён неверно.'
		return context


class CustomPasswordResetView(PasswordResetView):
	template_name = 'account/password_reset.html'
	form_class = CustomPasswordResetForm

	def get_context_data(self, **kwargs):
		context = super().get_context_data(**kwargs)

		if self.request.method == 'POST':
			form = CustomLoginForm(self.request)
			if not form.is_valid():
				context['error'] = 'Введите правильный адрес электронной почты.'
		return context


class CustomPasswordResetConfirmView(PasswordResetConfirmView):
	template_name = 'account/password_reset_confirm.html'
	form_class = CustomSetPasswordForm
