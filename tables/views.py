from django.shortcuts import render, get_object_or_404
from .models import UserInfo
from .models import Collection
from .models import Carts
from .models import Notifications
from django.http import HttpResponse
from django.core.mail import send_mail, BadHeaderError
from django.shortcuts import redirect
from django.conf import settings
import sys, os, cgi, urllib, re
from django.contrib.auth.decorators import login_required
from .filters import DressFilter
from django.core.mail import EmailMessage

@login_required
def create_account(request):
    return render(request, 'signup.html', {})

def table(request):
    return render(request, 'home.html', {})

def notFound(request):
    response = render(request,'404.html', {})
    response.status_code = 404
    return response

@login_required
def trial(request):
    user = UserInfo.objects.get(username = request.user.username)
    notif_list = Notifications.objects.filter(to_notify = user)
    notif_list = reversed(notif_list)
    notif_unseen = Notifications.objects.filter(to_notify = user, seen = False)
    brand_list = []
    for dress in Collection.objects.all():
            if dress.brand not in brand_list and dress.brand != '':
                brand_list.append(dress.brand)
    brand_list.sort()
    return render(request, 'feed.html', {'filter': Collection.objects.all().order_by('price'), 'notifications': notif_list, 'unseen': notif_unseen, 'brands': brand_list})

@login_required
def upload_another(request):
    user = UserInfo.objects.get(username = request.user.username)
    notif_list = Notifications.objects.filter(to_notify = user)
    notif_list = reversed(notif_list)
    notif_unseen = Notifications.objects.filter(to_notify = user, seen = False)
    return render(request, 'uploadanother.html', {'notifications': notif_list, 'unseen': notif_unseen})

@login_required
def update_info(request):
    if request.method == 'POST':
        user = UserInfo.objects.get(username = request.user.username)
        user.gender = request.POST['gender']
        user.email = request.POST['email']
        user.phone = request.POST['phone']
        sizes = request.POST.getlist('sizes[]')
        s = ""
        for c in sizes:
            s = s  + c + " "
        user.size = sizes

        user.save()
    user_info = UserInfo.objects.get(username = request.user.username)
    notif_list = Notifications.objects.filter(to_notify = user_info)
    notif_list = reversed(notif_list)
    notif_unseen = Notifications.objects.filter(to_notify = user_info, seen = False)
    return render(request, 'updateinfo.html', {'user': user_info, 'notifications': notif_list, 'unseen': notif_unseen})

def home(request):
    users = UserInfo.objects.all()
    return render(request, 'homepage.html', {})

@login_required
def upload_dresses(request):
    if request.method == 'POST':
        u = request.user.username
        g = request.POST['gender']
        e = request.POST['email']
        m = request.POST['phone']
        sizes = request.POST.getlist('sizes[]')
        s = ""
        for c in sizes:
            s = s  + c + " "

        user = UserInfo.objects.create(
            username = u,
            size = s,
            gender = g,
            email = e,
            phone = m,
        )
    return render(request, 'uploaddresses.html', {})

@login_required
def upload_pic(request):
    if request.method == 'POST':
        ni = request.user.username
        img = request.FILES['dressupload']
        p = request.POST['price']
        b = request.POST['brand']
        s = request.POST['size']
        fs = request.POST['saleorrent']
        occs = request.POST.getlist('occasions[]')
        o= ""
        for c in occs:
            o = o  + c + " "
        desc = request.POST['desc']
        dress = Collection.objects.create(
            photo = img,
            size = s,
            brand = b,
            occasions = o,
            price = p,
            title = desc,
            for_sale = fs,
            condition = 'good',
            total_likes = 0,
            seller = UserInfo.objects.get(username__iexact = ni)
            )
    user = UserInfo.objects.get(username = request.user.username)
    notif_list = Notifications.objects.filter(to_notify = user)
    notif_list = reversed(notif_list)
    notif_unseen = Notifications.objects.filter(to_notify = user, seen = False)
    brand_list = []
    for dress in Collection.objects.all():
        if dress.brand not in brand_list and dress.brand != '':
            brand_list.append(dress.brand)
        brand_list.sort()
    return render(request, 'feed.html', {'filter':Collection.objects.all().order_by('price'), 'notifications': notif_list, 'unseen': notif_unseen, 'brands': brand_list})

@login_required
def handle_new_user(request):
    ni = request.user.username
    if UserInfo.objects.filter(username = ni).exists():
        user = UserInfo.objects.get(username = request.user.username)
        notif_list = Notifications.objects.filter(to_notify = user)
        notif_list = reversed(notif_list)
        notif_unseen = Notifications.objects.filter(to_notify = user, seen = False)
        brand_list = []
        for dress in Collection.objects.all():
            if dress.brand not in brand_list and dress.brand != '':
                brand_list.append(dress.brand)
        brand_list.sort()
        return render(request, 'feed.html', {'filter': Collection.objects.all().order_by('price'), 'notifications': notif_list, 'unseen': notif_unseen, 'brands': brand_list})
    else:
        return render(request, 'signup.html', {})

@login_required
def search(request):
    dress_list = Collection.objects.order_by('price')
    # s = request.POST['size']
    # o = request.POST['occasions']
    # b = request.POST['brand']
    # p = request.POST['price']
    # fs = request.POST['for_sale']
    # keyword = request.POST['title']
    dress_filter = DressFilter(request.POST, queryset=dress_list)

    user = UserInfo.objects.get(username = request.user.username)
    notif_list = Notifications.objects.filter(to_notify = user)
    notif_list = reversed(notif_list)
    notif_unseen = Notifications.objects.filter(to_notify = user, seen = False)

    brand_list = []
    for dress in dress_list:
        if dress.brand not in brand_list and dress.brand != '':
            brand_list.append(dress.brand)
    brand_list.sort()

    return render(request, 'feed.html', {'notifications': notif_list, 'filter': dress_filter.qs, 'unseen': notif_unseen, 'brands': brand_list})

@login_required
def initialfeed(request):
    # dress_list = Collection.objects.all()
    # dress_filter = DressFilter(request.GET, queryset=dress_list)
    return render(request, 'feed.html', {'filter': Collection.objects.all()})

@login_required
def addtocart(request):
    if request.method == 'POST':
      a_by = UserInfo.objects.get(username__iexact = request.user.username)
      i = request.POST['dress_id']
      dress = Collection.objects.filter(id = i)[0]
      ou = dress.seller

    if Carts.objects.filter(dressInfo = dress, added_by = a_by).exists():
        return HttpResponse(status=204)

    t = a_by.username + " added " + dress.title.lower() + " to their cart!"
    Carts.objects.create (
        added_by = a_by,
        owner = UserInfo.objects.get(username = ou),
        dressInfo = dress
    )
    Notifications.objects.create (
        text = t,
        seen = False,
        to_notify = UserInfo.objects.get(username = ou),
    )
    return HttpResponse(status=204)

@login_required
def deletefromcart(request):
    if request.method == 'POST':
      i = request.POST['dress_id']
      Carts.objects.filter(id=i).delete()
    return cart(request)

@login_required
def deletefromcollection(request):
    if request.method == 'POST':
        i = request.POST['dress_id']
        dress = Collection.objects.get(id=i)
        os.remove(os.path.join(settings.MEDIA_ROOT,str(dress.photo.name) ))
        Collection.objects.filter(id=i).delete()
        user = UserInfo.objects.get(username = request.user.username)
        notif_list = Notifications.objects.filter(to_notify = user)
        notif_list = reversed(notif_list)
        notif_unseen = Notifications.objects.filter(to_notify = user, seen = False)
    return mydresses(request)

@login_required
def markavailable(request):
    if request.method == 'POST':
        i = request.POST['dress_id']
        dress = Collection.objects.get(id=i)
        dress.in_use = False
        dress.save()
    return mydresses(request)

@login_required
def markunavailable(request):
    if request.method == 'POST':
        i = request.POST['dress_id']
        dress = Collection.objects.get(id=i)
        dress.in_use = True
        dress.save()
    return mydresses(request)

@login_required
def like(request):
    if request.method == 'POST':
      l_by = request.user.username
      i = request.POST['dress_id']
      ou = Collection.objects.filter(id = i)[0].seller
      dress = Collection.objects.filter(id = i)[0]
      likes = dress.total_likes
      likes = likes + 1
      dress.total_likes = likes
      t = l_by + " liked " + dress.title.lower() + "!"
      if Notifications.objects.filter(text = t).exists():
        return HttpResponse(status=204)
      Notifications.objects.create (
        text = t,
        seen = False,
        to_notify = UserInfo.objects.get(username = ou),
    )
    return HttpResponse(status=204)

@login_required
def cart(request):
    u = UserInfo.objects.get(username = request.user.username)
    this_cart = Carts.objects.filter(added_by = u)
    notif_list = Notifications.objects.filter(to_notify = u)
    notif_list = reversed(notif_list)
    notif_unseen = Notifications.objects.filter(to_notify = u, seen = False)
    return render(request, 'cart.html', {'filter': this_cart, 'notifications': notif_list, 'unseen': notif_unseen})

@login_required
def mydresses(request):
    u = request.user.username
    user = UserInfo.objects.get(username = u)
    my_dresses = Collection.objects.filter(seller = user)
    user = UserInfo.objects.get(username = request.user.username)
    notif_list = Notifications.objects.filter(to_notify = user)
    notif_list = reversed(notif_list)
    notif_unseen = Notifications.objects.filter(to_notify = user, seen = False)
    return render(request, 'mydresses.html', {'filter': my_dresses, 'notifications': notif_list, 'unseen': notif_unseen})

@login_required
def editdress(request):
    if request.method=='GET':
        i = request.GET['dress']
        dress = Collection.objects.get(id=i)
    user = UserInfo.objects.get(username = request.user.username)
    notif_list = Notifications.objects.filter(to_notify = user)
    notif_list = reversed(notif_list)
    notif_unseen = Notifications.objects.filter(to_notify = user, seen = False)
    return render(request, 'editdress.html', {'dress_info': [dress], 'notifications': notif_list, 'unseen': notif_unseen})

@login_required
def dressedited(request):
    if request.method == 'POST':
        i = request.POST['change']
        # if type(i) != int or i > Collection.objects.latest('id').id:
        #     return render(request,'404.html', {})
        dress = Collection.objects.get(id=i)
        # if dress.owner ==  UserInfo.objects.get(username = request.user.username):
        dress.size = request.POST['size']
        dress.price = request.POST['price']
        dress.brand = request.POST['brand']
        dress.for_sale = request.POST['saleorrent']
        occs = request.POST.getlist('occasions[]')
        o= ""
        for c in occs:
            o = o  + c + " "
        dress.occasions = o
        dress.title = request.POST['desc']
        dress.save()
        # else:
        #     return render(request,'404.html', {})
    return mydresses(request)

@login_required
def initial_feed(request):
    return render('initialfeed.html', {'dresses': Collection.objects.all()})

@login_required
def get_liked(request):
    u = UserInfo.objects.get(username = request.user.username)
    my_liked = Notifications.objects.filter(text__contains = u.username + " liked")
    notif_list = Notifications.objects.filter(to_notify = u)
    notif_list = reversed(notif_list)
    notif_unseen = Notifications.objects.filter(to_notify = u, seen = False)
    my_dresses = [ ]
    dresses = Collection.objects.all()
    for d in dresses:
        temp = my_liked.filter(text__contains = "liked " + d.title.lower() + "!")
        for t in temp:
            my_dresses.append(d)
    return render(request, 'liked.html', {'filter': my_dresses, 'notifications': notif_list, 'unseen': notif_unseen})

@login_required
def rent(request):
    r_by = request.user.username
    i = request.GET['dress']
    d = Collection.objects.get(id = i)
    o = d.seller
    context={
      'object': [d]
    }
    t = r_by + " wants to rent your " + d.title.lower() + ", expect an email from them soon!"
    if Notifications.objects.filter(text = t).exists() == False:
        Notify = Notifications.objects.create (
            text = t,
            seen = False,
            to_notify = o,
        )
    u = UserInfo.objects.get(username = request.user.username)
    notif_list = Notifications.objects.filter(to_notify = u)
    notif_list = reversed(notif_list)
    notif_unseen = Notifications.objects.filter(to_notify = u, seen = False)
    return render(request, 'rent.html', {'object':[d], 'notifications': notif_list, 'unseen': notif_unseen})

@login_required
def seen(request):
    u = UserInfo.objects.get(username = request.user.username)
    notif_list = Notifications.objects.filter(to_notify = u)
    notif_list = reversed(notif_list)

    for n in notif_list:
        n.seen = True
        n.save()

    brand_list = []
    for dress in Collection.objects.all():
        if dress.brand not in brand_list and dress.brand != '':
            brand_list.append(dress.brand)
    brand_list.sort()
    notif_unseen = Notifications.objects.filter(to_notify = u, seen = False)
    #return render(request, 'feed.html', {'filter': Collection.objects.all(), 'notifications': notif_list, 'unseen': notif_unseen, 'brands': brand_list})
    return trial(request)

@login_required
def send_email(request):
    if request.method == 'POST':
        subject = "Update from PresstoDress: " + request.user.username + " wants to buy/rent your dress"
        i = request.POST['dress_id']
        dress = Collection.objects.get(id = i)
        message = request.POST['template'] + "\n\nReply to this email directly to contact the buyer/renter!\nPS: please remember to mark your dress as 'in-use' in my dresses if the transaction works out!\n\nHave feedback? Send it here: https://docs.google.com/forms/d/e/1FAIpQLSfco1R_iKvJZ1QUK0kS-xzCKMydFLw4Dyt-Rv-ikzqrzNoYUg/viewform"
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = dress.seller.username + "@princeton.edu"
        if subject and message and from_email:
            try:
                email = EmailMessage(subject, message, from_email, [to_email], reply_to = [request.user.username+"@princeton.edu"])
                email.send(fail_silently=False)
            except BadHeaderError:
                return HttpResponse('Invalid header found.')
            return render(request, 'emailsent.html', {})
        else:
            # In reality we'd use a form class
            # to get proper validation errors.
            return HttpResponse('Enter details properly')
    else:
        return HttpResponse(status=204)

@login_required
def unlike(request):
    if request.method == 'POST':
        ul_by = request.user.username
        title = request.POST['dress_title']
        my_liked = Notifications.objects.filter(text__contains = ul_by + " liked")
        to_delete = my_liked.filter(text__contains = "liked " + title.lower() + "!")
        for t in to_delete:
            Notifications.objects.get(id = t.id).delete()
    return get_liked(request)


@login_required
def tutorial(request):
    return render(request, 'tutorial.html', {})

@login_required
def buy(request):
    r_by = request.user.username
    i = request.GET['dress']
    d = Collection.objects.get(id = i)
    o = d.seller
    t = r_by + " wants to buy your " + d.title.lower() + ", expect an email from them soon!"

    context={
      'object': [d]
    }
    if Notifications.objects.filter(text = t).exists() is False:
        Notify = Notifications.objects.create (
        text = t,
        seen = False,
        to_notify = o,
         )
    user = UserInfo.objects.get(username = request.user.username)
    notif_list = Notifications.objects.filter(to_notify = user)
    notif_list = reversed(notif_list)
    notif_unseen = Notifications.objects.filter(to_notify = user, seen = False)
    return render(request, 'buy.html', {'notifications': notif_list, 'unseen': notif_unseen, 'object':[d]})

@login_required
def about(request):
    user = UserInfo.objects.get(username = request.user.username)
    notif_list = Notifications.objects.filter(to_notify = user)
    notif_list = reversed(notif_list)
    notif_unseen = Notifications.objects.filter(to_notify = user, seen = False)
    return render(request, 'about.html', {'notifications': notif_list, 'unseen': notif_unseen})

@login_required
def make_template(request):
    if request.method == 'POST':
        start_date = request.POST['rentalstart'][5:]
        end_date = request.POST['rentalend'][5:]
        extra_info = request.POST['extrainfo']
        i = request.POST['dress_id']
        dress = Collection.objects.get(id = i)
        username = dress.seller.username

        t = "Hi " + username+"!\n\n"  + "I want to rent your " + dress.title.lower() + " dress from " + start_date + " to " + end_date
        t = t + ".\n\nLet me know what is a good place to pick it up from, and when I should come pick it up.\n\n" + extra_info
        if extra_info != '':
            t = t + "\n\n Best,\n" + request.user.username
        else:
            t = t + "Best,\n" + request.user.username

        return render(request, 'rent.html', {'text': t, 'object':[dress]})
    else:
        return cart(request)

@login_required
def make_template_buy(request):
    if request.method == 'POST':
        pick_date = request.POST["pickupdate"][5:]
        extra_info = request.POST['extrainfo']
        i = request.POST['dress_id']
        dress = Collection.objects.get(id = i)
        username = dress.seller.username

        t = "Hi " + username+"!\n\n"  + "I want to purchase your " + dress.title.lower() + " dress, and, I'd like to pick it up by " + pick_date
        t = t + ".\n\nLet me know what is a good place to pick it up from, and when I should come pick it up.\n\n" + extra_info
        if extra_info != '':
            t = t + "\n\nBest,\n" + request.user.username
        else:
            t = t + "Best,\n" + request.user.username
        return render(request, 'buy.html', {'text': t, 'object':[dress]})
    else:
        return cart(request)

@login_required
def upload_mobile(request):
    return render(request, 'upload_mobile.html', {})

@login_required
def post_mobileupload(request):
    if request.method == 'POST':
        ni = request.user.username
        img = request.FILES['dressupload']
        p = request.POST['price']
        b = request.POST['brand']
        s = request.POST['size']
        fs = request.POST['saleorrent']
        occs = request.POST.getlist('occ[]')
        o= ""
        for c in occs:
            o = o  + c + " "
        desc = request.POST['desc']
        dress = Collection.objects.create(
            photo = img,
            size = s,
            brand = b,
            occasions = o,
            price = p,
            title = desc,
            for_sale = fs,
            condition = 'good',
            total_likes = 0,
            seller = UserInfo.objects.get(username__iexact = ni)
            )
    return render(request, 'post_mobileupload.html', {})