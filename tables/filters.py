from .models import Collection
from .models import UserInfo
import django_filters

class DressFilter(django_filters.FilterSet):
 size = django_filters.CharFilter(lookup_expr='iexact')
 occasions = django_filters.CharFilter(lookup_expr='icontains')
 brand = django_filters.CharFilter(lookup_expr='icontains')
 title = django_filters.CharFilter(lookup_expr='icontains')
 price = django_filters.NumberFilter(lookup_expr='lte')
 for_sale = django_filters.BooleanFilter(lookup_expr='exact')
 class Meta:
     model = Collection
     fields = ['size', 'brand', 'occasions', 'price', 'title', 'for_sale']

class UserFilter(django_filters.FilterSet):
 class Meta:
  model = UserInfo
  fields = ['gender', 'email', 'phone']