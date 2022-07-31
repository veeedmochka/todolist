from django.contrib.auth.forms import AuthenticationForm, UserCreationForm, PasswordChangeForm, PasswordResetForm
from django.contrib.auth.forms import SetPasswordForm
from django import forms
from django.contrib.auth.models import User


class CustomLoginForm(AuthenticationForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['username'].widget.attrs = {
            'class': 'form-control',
            'autocomplete': 'off',
            'placeholder': 'Логин'
        }
        self.fields['password'].widget.attrs = {
            'class': 'form-control',
            'autocomplete': 'off',
            'placeholder': 'Пароль'
        }


class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(
        label='Адрес электронной почты',
        max_length=254,
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'autocomplete': 'off',
            'placeholder': 'Адрес электронной почты'
        }),
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['username'].widget.attrs = {
            'class': 'form-control',
            'autocomplete': 'off',
            'placeholder': 'Логин'
        }
        self.fields['password1'].widget.attrs = {
            'class': 'form-control',
            'autocomplete': 'off',
            'placeholder': 'Пароль'
        }
        self.fields['password2'].widget.attrs = {
            'class': 'form-control',
            'autocomplete': 'off',
            'placeholder': 'Подтвердите пароль'
        }

    class Meta:
        model = User
        fields = ('email', 'username', 'password1', 'password2')


class CustomPasswordChangeForm(PasswordChangeForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['old_password'].widget.attrs = {
            'class': 'form-control',
            'autocomplete': 'off',
            'placeholder': self.fields['old_password'].label
        }
        self.fields['new_password1'].widget.attrs = {
            'class': 'form-control',
            'autocomplete': 'off',
            'placeholder': self.fields['new_password1'].label
        }
        self.fields['new_password2'].widget.attrs = {
            'class': 'form-control',
            'autocomplete': 'off',
            'placeholder': self.fields['new_password2'].label
        }


class CustomPasswordResetForm(PasswordResetForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['email'].widget.attrs = {
            'class': 'form-control',
            'autocomplete': 'off',
            'placeholder': self.fields['email'].label
        }


class CustomSetPasswordForm(SetPasswordForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['new_password1'].widget.attrs = {
            'class': 'form-control',
            'autocomplete': 'off',
            'placeholder': self.fields['new_password1'].label
        }
        self.fields['new_password2'].widget.attrs = {
            'class': 'form-control',
            'autocomplete': 'off',
            'placeholder': self.fields['new_password2'].label
        }
