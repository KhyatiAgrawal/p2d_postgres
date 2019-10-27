from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import UserInfo
from .models import Dress
from .models import Carts
from .models import Alerts 
from .serializers import *


from django.shortcuts import render, get_object_or_404

from django.http import HttpResponse
from django.core.mail import send_mail, BadHeaderError
from django.shortcuts import redirect
from django.conf import settings
import sys, os, cgi, urllib, re
from django.contrib.auth.decorators import login_required
from .filters import DressFilter
from django.core.mail import EmailMessage


# Confirm stuff here 
# Make sure this works for all dresses 
@login_required
def dress_list(request):
    """
    List of dresses according to the search request passed
    """
    # to do
    # Get dress list using filter and tssearch
    # Apply other filters
    # Serialize return query set
    # Right now this is using old search method
    # See if you can use tssearch for better searches
    if request.method == 'GET':
        dress_list = Dress.objects.all()
    if request.method == 'PUT':
        dress_list = DressFilter(request.data, queryset=Dress.objects.all())
    serializer = DressesSerializer(dress_filter, context={'request': request})  
    if serializer.is_valid():
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@login_required
def getOrUpdate_cart(request):
    # The given username should exist in the cart table
    username = request.user.username
    try:
        cart = Carts.objects.get(user=username)
    except Carts.DoesNotExist:
        # if cart doesn't exist create an empty cart object
        cart = Carts.objects.create(
            user = username
            )
        cart.save()

    # return the cart if the request is a GET request
    if request.method == 'GET':
        # Serialize the cart object and return
        serializer = DressesSerializer(cart.dressesAdded, context={'request': request})
        return Response(serializer.data)
 
    # update the cart if the request is a POST request
    elif request.method == 'PUT':
        dressObj = Dress.objects.get(id = request.PUT['dressToAdd'])
        cart.dressesAdded.add(dressObj)
        cart.save()
        serializer = DressesSerializer(cart.dressesAdded, context={'request': request})  
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        dressObj = Dress.objects.get(id = request.DELETE['dressToDelete'])
        cart.dressesAdded.remove(dressObj)
        cart.save()
        serializer = DressesSerializer(cart.dressesAdded, context={'request': request})  
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@login_required
def getOrUpdate_favorite(request):
    # The given username should exist in the favorites table
    username = request.user.username
    try:
        userFavorites= Carts.objects.get(user=username)
    except Carts.DoesNotExist:
        # if no dress is liked 
        userFavorites = Carts.objects.create(
            user = username
            )
        userFavorites.save()

    # return the favorites if the request is a GET request
    if request.method == 'GET':
        # Serialize the object and return
        serializer = DressesSerializer(userFavorites.dressesLiked, context={'request': request})     
        return Response(serializer.data)
 
    # update the favorites if the request is a POST request
    elif request.method == 'PUT':
        dressObj = Dress.objects.get(id = request.PUT['dressToAdd'])
        userFavorites.dressesLiked.add(dressObj)
        userFavorites.save()
        serializer = DressesSerializer(userFavorites.dressesLiked, context={'request': request})  
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        dressObj = Dress.objects.get(id = request.DELETE['dressToDelete'])
        userFavorites.dressesAdded.remove(dressObj)
        userFavorites.save()
        serializer = DressesSerializer(userFavorites.dressesLiked, context={'request': request})
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@login_required
def getOrUpdate_ForTrial(request):
    # return the cart if the request is a GET request
    uname = request.user.username
    cart = Carts.objects.get(user=uname)
    tentativeDresses = []
    for DressObj in cart.dressesAdded:
        # Change this line below
        # Only allow a dress to appear once in the alerts table
        # Add the first five not booked for trial dresses to
        # the tentative trial dresses
        existing = alerts_dressesSelected.objects.filter(dress_id=DressObj.id)
        if len(existing) == 0:
            tentativeDresses.append(dressObj)
        if len(tentativeDresses) == 5:
            break
    serializer = DressesSerializer(tentativeDresses, context={'request': request})  
    if serializer.is_valid():
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @login_required
# def getAvailableTimes(request):
    # Here is where you need to:
    # Pull times from google calendar labeled pressToDress pickup
    # Show the user options for the next two days
    

# @login_required
# def getOrUpdate_Alerts(request):
    # here is where you input the modified date and time in the trial table
    # The request will contain the list of dresses the user wants to book for trial
    # The entries must be added with the specificied date and time in Alerts
    # The entries must be removed from the users cart
    # Allow a maximum of 5 dresses for trial per user
    # The user must finish existing trial before starting a new one 






@login_required
def getOrUpdate_userInfo(request):
    # The given username should exist in the favorites table
    uname = request.user.username
    try:
        uInfo = UserInfo.objects.get(user=uname)
    except UserInfo.DoesNotExist:
        # if no dress is liked 
        uInfo = UserInfo.objects.create(
            username = uname
            )
        uInfo.save()

    # return the favorites if the request is a GET request
    if request.method == 'GET':
        # Serialize the object and return
        serializer = UInfoSerializer(uInfo, context={'request': request})     
        return Response(serializer.data)
 
    # update the favorites if the request is a POST request
    elif request.method == 'PUT':
        uInfo.gender = request.PUT['gender']
        uInfo.email = request.PUT['email']
        uInfo.phone = request.PUT['phone']
        sizes = request.PUT.getlist('sizes[]')
        s = ""
        for c in sizes:
            s = s  + c + " "
        uInfo.size = sizes
        uInfo.save()

        serializer = UInfoSerializer(uInfo, context={'request': request})  
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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


