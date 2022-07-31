from django.urls import path
from django.contrib.auth.views import PasswordChangeDoneView, PasswordResetDoneView, PasswordResetCompleteView

from .views import *


urlpatterns = [
	path('', AccountView.as_view(), name='account'),
	path('login/', CustomLoginView.as_view(), name='login'),
	path('signup/', SignUpView.as_view(), name='signup'),
	path('logout/', log_out, name='logout'),
	path('password-change/', CustomPasswordChangeView.as_view(), name='password_change'),
	path('password-change/done/', PasswordChangeDoneView.as_view(
		template_name='account/password_change_done.html'), name='password_change_done'),
	path('password-reset/', CustomPasswordResetView.as_view(), name='password_reset'),
	path('password-reset/done/', PasswordResetDoneView.as_view(
		template_name='account/password_reset_done.html'), name='password_reset_done'),
	path('password-reset/<uidb64>/<token>/', CustomPasswordResetConfirmView.as_view(), name='password_reset_confirm'),
	path('password-reset/complete/', PasswordResetCompleteView.as_view(
		template_name='account/password_reset_complete.html'), name='password_reset_complete'),
]
