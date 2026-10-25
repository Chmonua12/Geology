from django.urls import path

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("api/geogid/", views.geogid_chat, name="geogid_chat"),
]
