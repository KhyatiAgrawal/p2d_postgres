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
    DateTime = serializers.DateTimeField(format = '%m/%d/%y %I:%M %p')
    PersonIncharge = serializers.CharField(max_length=30)



