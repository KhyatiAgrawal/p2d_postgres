from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
import django_cas_ng.views

from tables import views

handler404 = 'mysite.views.notFound'
handler500 = 'mysite.views.error'
urlpatterns = [
    url(r'temp/$', views.handle_new_user, name='p2d'),
    url(r'^admin/', admin.site.urls),
    url(r'^feed/$', views.trial),
    url(r'^about/$', views.about, name = 'About'),
    url(r'^$', views.home, name='home'),
    url(r'^accounts/login/$', django_cas_ng.views.login, name='cas_ng_login'),
    url(r'^accounts/logout/$', django_cas_ng.views.logout, name='cas_ng_logout'),
    url(r'^accounts/callback$', django_cas_ng.views.callback, name='cas_ng_proxy_callback'),
    url(r'^dressedited/$', views.dressedited, name = 'Edited'),
    url(r'editdress/$', views.editdress, name='Edit dress'),
    url(r'^mydresses/$', views.mydresses, name = 'My Dresses'),
    url(r'uploaddresses/$', views.upload_dresses, name = 'Upload'),
    url(r'uploadanother/$', views.upload_another, name = 'Upload More'),
    url(r'liked/$', views.get_liked, name = 'liked'),
    url(r'updateinfo/$', views.update_info, name = 'Update Info'),
    # url(r'uploaddresses/feed/$', views.upload_pic, name = 'Feed'),
    url(r'tutorial/$', views.tutorial, name = 'Tutorial'),
    url(r'feed/$', views.upload_pic, name = 'Feed'),
    url(r'uploadanother/feed/$', views.upload_pic, name = 'Feed2'),
    url(r'search', views.search, name='search'),
    url(r'^like/', views.like, name='like'),
    url(r'^seen/', views.seen, name='Seen'),
    url(r'^viewcart/', views.cart, name = 'Cart'),
    url(r'^buy/', views.buy, name = 'Buy'),
    url(r'^rent/', views.rent, name = 'Rent'),
    url(r'addtocart', views.addtocart, name='Add to cart'),
    url(r'deletefromcart/', views.deletefromcart, name='Delete from cart'),
    url(r'deletefromcollection/', views.deletefromcollection, name='Delete from collection'),
    url(r'markavailable/', views.markavailable, name='Mark available'),
    url(r'initialfeed/', views.initial_feed, name='Initial feed'),
    url(r'sendemail/', views.send_email, name = 'email'),
    url(r'unlike/', views.unlike, name = 'Unlike'),
    url(r'maketemplatebuy/', views.make_template, name='Template'),
	# url(r'login/', views.create_account, name='Sign up'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
