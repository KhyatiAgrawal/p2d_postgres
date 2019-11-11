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
    url(r'^api/alerts/', views.getOrUpdate_Alerts),
    url(r'^api/favorites/', views.getOrUpdate_favorite),
    url(r'^api/availability', views.get_AvailableForTrial),
    url(r'^api/myOrders', views.get_rentalHistory),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
