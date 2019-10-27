from .models import Dress
from .models import UserInfo
import django_filters

class DressFilter(django_filters.FilterSet):
 size = django_filters.CharFilter(lookup_expr='iexact')
 occasions = django_filters.CharFilter(lookup_expr='icontains')
 brand = django_filters.CharFilter(lookup_expr='icontains')
 title = django_filters.CharFilter(lookup_expr='icontains')
 price = django_filters.NumberFilter(lookup_expr='lte')
 description = django_filters.CharFilter(lookup_expr='icontains')
 class Meta:
     model = Dress
     fields = ['size', 'brand', 'occasions', 'price', 'title']

class UserFilter(django_filters.FilterSet):
 class Meta:
  model = UserInfo
  fields = ['gender', 'email', 'phone']