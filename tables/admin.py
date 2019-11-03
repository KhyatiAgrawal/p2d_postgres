# Register your models here.
from django.contrib import admin
from .models import UserInfo
from .models import Dress
from .models import Carts
from .models import Alerts

admin.site.register(UserInfo)
admin.site.register(Dress)
admin.site.register(Carts)

admin.site.register(Alerts)
