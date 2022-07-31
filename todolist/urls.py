from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('listapp.urls')),
    path('account/', include('account.urls')),
    path('api/v1/', include('api.urls')),
    path('admin/', admin.site.urls),
]
