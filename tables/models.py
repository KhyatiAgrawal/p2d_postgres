from django.db import models
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image as Img
from PIL import ExifTags
from io import BytesIO
from django.db.models.signals import post_delete
import sys

class UserInfo(models.Model):
    username = models.CharField(max_length=30, unique=True)
    size = models.CharField(max_length=50)
    gender = models.CharField(max_length=20)
    email = models.EmailField(max_length=40)
    phone = models.CharField(max_length=50)
    def __str__(self):
        return self.username

class Collection(models.Model):
    photo = models.ImageField(upload_to='dresses', blank=True)
    size = models.CharField(max_length=10)
    brand = models.CharField(max_length=20)
    occasions = models.CharField(max_length=70)
    price = models.IntegerField()
    title = models.CharField(max_length=70)
    condition = models.CharField(max_length=30)
    in_use = models.BooleanField(default=False)
    for_sale = models.BooleanField(default=False)
    total_likes = models.IntegerField()
    prev_photoname  = None
    seller = models.ForeignKey(UserInfo, related_name='Seller', on_delete=models.CASCADE)
    def __init__(self, *args, **kwargs):
        super(Collection, self).__init__(*args, **kwargs)
        self.prev_photoname  = self.photo.name

    def save(self, *args, **kwargs):
        width = 300
        height = 400
        size = (width,height)
        isSame = False
        if self.pk is None or self.photo.name != self.prev_photoname:
            image = Img.open(BytesIO(self.photo.read()))
            for orientation in ExifTags.TAGS.keys() :
                if ExifTags.TAGS[orientation]=='Orientation' : break
            try:
                exif=dict(image._getexif().items())
                if exif:
                    if   exif[orientation] == 3:
                        image=image.rotate(180, expand=True)
                    elif exif[orientation] == 6:
                        image=image.rotate(270, expand=True)
                    elif exif[orientation] == 8:
                        image=image.rotate(90, expand=True)
            except:
                # There is AttributeError: _getexif sometimes.
                pass

            image.thumbnail(size, Img.ANTIALIAS)

            output = BytesIO()
            image.save(output, format='JPEG')
            output.seek(0)
            self.photo = InMemoryUploadedFile(output,'ImageField', "%s.jpg" %self.photo.name.split('.')[0], 'image/jpeg', sys.getsizeof(output), None)
        super(Collection, self).save(*args, **kwargs)
        self.prev_photoname  = self.photo.name

    def __str__(self):
        return self.title

class Carts(models.Model):
    dressInfo = models.ForeignKey(Collection, related_name='URL', on_delete=models.CASCADE)
    added_by = models.ForeignKey(UserInfo, related_name='Username', on_delete=models.CASCADE)
    owner = models.ForeignKey(UserInfo, related_name='Owner', on_delete=models.CASCADE)
    def __str__(self):
        return self.added_by.username + " " + self.dressInfo.title


class Notifications(models.Model):
    text = models.CharField(max_length=255)
    seen = models.BooleanField()
    to_notify = models.ForeignKey(UserInfo, related_name='PersonToNotify', on_delete=models.CASCADE)

class Feed(models.Model):
    description = models.CharField(max_length=255, blank=True)
    document = models.FileField(upload_to='media/dresses/')

#class Posts(models.Model):
#   name = models.CharField(verbose_name='Name', null=False, max_length=50)
#   content = models.CharField(verbose_name='Content', null=False, max_length=300)
