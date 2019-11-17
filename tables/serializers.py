from rest_framework import serializers
from .models import Dress
from .models import Alerts
from .models import UserInfo

# Basic serializer
class DressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dress 
        fields = ('id','view1', 'view2', 'view3', 'size','brand','occasions', 'price', 'title', 'description', 'unavailableDates')


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


# This dress serializer is used serialize:
# 1. results from the users Cart
# 2. results from "Dresses" that matches the user's searchc criteria
# 3. the user's favorited dresses
# 4. the dresses from the user's cart available for trial
class DressesSerializer(serializers.Serializer):
    items = DressSerializer(many=True)


# This serializers is used serialize:
# 1. Objects in the Alerts table
# 2. Calls to the "getAvailableTimes" method will use this serializer
class AlertsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alerts 
        fields = ('user','dressesSelected', 'trialDateAndTime')

class UInfoSerializer(serializers.Serializer):
    class Meta:
        model = UserInfo
        fields = ('username','size', 'gender', 'email', 'phone', 'numberRented')

class AvailableTimesSerializer(serializers.Serializer):
    """Your data serializer, define your fields here."""
    DateTime = serializers.DateTimeField(format = '%m/%d/%y %H:%M')
    PersonIncharge = serializers.CharField(max_length=30)

class RentalHistorySerializer(serializers.Serializer):
    """Your data serializer, define your fields here."""
    Date = serializers.DateTimeField(format = '%m/%d')
    RentedDress = DressSerializer()


