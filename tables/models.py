from django.db import models
import sys

class UserInfo(models.Model):
    username = models.CharField(max_length=30, unique=True)
    size = models.CharField(max_length=50)
    gender = models.CharField(max_length=20)
    email = models.EmailField(max_length=40)
    phone = models.CharField(max_length=50)
    numberRented = models.IntegerField(default = 0)



class Dress(models.Model):
    id = models.IntegerField(primary_key=True)

    # The three views of the photos
    view1 = models.ImageField(upload_to='./dresses/view1', blank=True)
    view2 = models.ImageField(upload_to='./dresses/view2', blank=True)
    view3 = models.ImageField(upload_to='./dresses/view3', blank=True)

    # Information about the dress
    size = models.CharField(max_length=10)
    brand = models.CharField(max_length=20)
    occasions = models.CharField(max_length=70)
    price = models.IntegerField()
    title = models.CharField(max_length=70)
    description = models.CharField(max_length=500)
    unavailableDates = models.CharField(max_length=500)

    def __str__(self):
        return self.id



# Keeps track of what dresses are associated with what users
class Carts(models.Model):
    user = models.ForeignKey(UserInfo, related_name='RelatedUser', on_delete=models.CASCADE)
    dressesAdded = models.ManyToManyField(Dress, related_name='CartDresses')
    dressesLiked = models.ManyToManyField(Dress, related_name='LikedDresses')
    rentalHistory = models.CharField(max_length=1000, default = "")

    
# Keeps track of the dresses and trial time a person has selected 
class Alerts(models.Model):
    user = models.ForeignKey(UserInfo, related_name='UserWhoBooked', on_delete=models.CASCADE)
    dressesSelected = models.ManyToManyField(Dress)
    trialDateAndTime = models.DateTimeField(null=True)


