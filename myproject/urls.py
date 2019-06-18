from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django_filters.views import FilterView
from tables.filters import DressFilter

import django_cas_ng.views

from tables import views

urlpatterns = [
    url(r'temp/$', views.handle_new_user, name='p2d'),
    url(r'^admin/', admin.site.urls),
    url(r'^feed/$', views.trial),
    url(r'^about/$', views.about, name = 'About'),
    url(r'^$', views.home, name='home'),
    url(r'^accounts/login/$', django_cas_ng.views.LoginView.as_view(), name='cas_ng_login'),
    url(r'^accounts/logout/$', django_cas_ng.views.LogoutView.as_view(), name='cas_ng_logout'),
    url(r'^accounts/callback$', django_cas_ng.views.CallbackView.as_view(), name='cas_ng_proxy_callback'),
    url(r'^dressedited/$', views.dressedited, name = 'Edited'),
    url(r'editdress/', views.editdress, name='Edit dress'),
    url(r'^mydresses/$', views.mydresses, name = 'My Dresses'),
    url(r'uploaddresses/$', views.upload_dresses, name = 'Upload'),
    url(r'uploadanother/$', views.upload_another, name = 'Upload More'),
    url(r'liked/$', views.get_liked, name = 'liked'),
    url(r'updateinfo/$', views.update_info, name = 'Update Info'),
    url(r'uploaddresses/feed/$', views.upload_pic, name = 'Feed'),
    url(r'uploadanother/feed/$', views.upload_pic, name = 'Feed2'),
    #url(r'tutorial/$', views.tutorial, name = 'Tutorial'),
    url(r'search', views.search, name='search'),
    url(r'^like/', views.like, name='like'),
    url(r'^seen/', views.seen, name='Seen'),
    url(r'^viewcart/', views.cart, name = 'Cart'),
    url(r'^rent/', views.rent, name = 'Rent'),
    url(r'^buy/', views.buy, name = 'Buy'),
    url(r'addtocart', views.addtocart, name='Add to cart'),
    url(r'deletefromcart/', views.deletefromcart, name='Delete from cart'),
    url(r'deletefromcollection/', views.deletefromcollection, name='Delete from collection'),
    url(r'markavailable/', views.markavailable, name='Mark available'),
    url(r'markunavailable/', views.markunavailable, name='Mark unavailable'),
    url(r'initialfeed/', views.initial_feed, name='Initial feed'),
    url(r'maketemplatebuy/', views.make_template_buy, name='Generate template'),
    url(r'maketemplate/', views.make_template, name='Generate template'),
    url(r'sendemail/', views.send_email, name = 'email'),
    url(r'unlike/', views.unlike, name = 'Unlike'),
    url(r'mobileupload', views.upload_mobile, name ='Upload'),
    url(r'picuploaded/', views.post_mobileupload, name ='Thanks!'),
    # url(r'', views.home, name='home'),
	# url(r'login/', views.create_account, name='Sign up'),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
