from django.urls import path

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("api/auth/register/", views.register_account, name="register_account"),
    path("api/auth/login/", views.login_account, name="login_account"),
    path("api/auth/logout/", views.logout_account, name="logout_account"),
    path("api/geogid/", views.geogid_chat, name="geogid_chat"),
]
