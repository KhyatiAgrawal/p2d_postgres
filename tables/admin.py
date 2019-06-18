# Register your models here.
from django.contrib import admin
from .models import UserInfo
from .models import Collection
from .models import Carts
from .models import Notifications

admin.site.register(UserInfo)
admin.site.register(Collection)
admin.site.register(Carts)
admin.site.register(Notifications)
