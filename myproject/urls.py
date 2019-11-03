from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
import django_cas_ng.views

from django.urls import path
from tables import views

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^api/feed/$', views.dress_list),
    url(r'^api/cart/', views.getOrUpdate_cart),
    url(r'^api/alerts/', views.getOrUpdate_alerts),
    url(r'^api/favories/', views.getOrUpdate_favorite)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
