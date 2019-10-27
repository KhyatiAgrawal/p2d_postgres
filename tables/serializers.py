from rest_framework import serializers
from .models import Dress
from .models import Alerts

class DressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dress 
        fields = ('id','view1', 'view2', 'view3', 'size','brand','occasions', 'price', 'title', 'description', 'availability')


# class CartsSerializer(serializers.ModelSerializer):
#     # check this
# 	dressesAdded = serializers.PrimaryKeyRelatedField(many=True, queryset=Dress.objects.all())
#     class Meta:
#         model = Carts 
#         fields = ('user','dressesAdded')

# class FavoritesSerializer(serializers.ModelSerializer):
#     # check this
#     dressesLiked = serializers.PrimaryKeyRelatedField(many=True, queryset=Dress.objects.all())

#     class Meta:
#         model = Carts 
#         fields = ('user','dressesLiked')

class DressesSerializer(serializers.Serializer):
    items = DressSerializer(many=True)


class AlertsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alerts 
        fields = ('user','dressSelected', 'trialDateAndTime')
