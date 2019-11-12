from .models import Dress
from .models import UserInfo
import django_filters

class DressFilter(django_filters.FilterSet):
 size = django_filters.CharFilter(lookup_expr='icontains')
 occasions = django_filters.CharFilter(lookup_expr='icontains')
 brand = django_filters.CharFilter(lookup_expr='icontains')
 title = django_filters.CharFilter(lookup_expr='icontains')
 price = django_filters.NumberFilter(lookup_expr='lte')
 description = django_filters.CharFilter(lookup_expr='icontains')
 class Meta:
     model = Dress
     fields = ['size', 'brand', 'occasions', 'price', 'title', 'description']

class UserFilter(django_filters.FilterSet):
 class Meta:
  model = UserInfo
  fields = ['gender', 'email', 'phone']


 def CustomFilter(myDict):
 	dress_filter = Dress.objects.all().order_by('id')
 	for key in myDict:
 		if key == 'occasion':
 			dress_filter = dress_filter.filter(reduce(operator.or_, (Q(occasions__contains=x) for x in myDict[key])))
 		elif key == 'size':
 			dress_filter = dress_filter.filter(reduce(operator.or_, (Q(size__contains=x) for x in myDict[key])))
 		elif key == 'keyword':
 			dress_filter = dress_filter.filter(reduce(operator.or_, (Q(description__contains=x) for x in myDict[key])))
 		else:
 			dress_filter = dress_filter.filter(price__lte = myDict[key])
 	return dress_filter