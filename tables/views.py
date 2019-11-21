from __future__ import print_function
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from functools import reduce
import operator
from django.db.models import Q

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

import datetime
from datetime import datetime as dt
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from rest_framework.decorators import api_view, renderer_classes
from django.views.decorators.csrf import csrf_exempt

from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt



# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/calendar.events']

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

@api_view((['GET', 'POST']))
@csrf_exempt
@login_required
def dress_list(request):
    if request.method == 'GET':
        dress_filter = Dress.objects.all().order_by('id')
        serializer = DressSerializer(dress_filter, many=True) 
        return Response(serializer.data, status=status.HTTP_200_OK, template_name=None)
    else:
        dress_filter = CustomFilter(request.data)
        serializer = DressSerializer(dress_filter, many=True) 
        return Response(serializer.data, status=status.HTTP_200_OK, template_name=None)

@api_view((['GET', 'PUT', 'DELETE']))
@login_required
def getOrUpdate_cart(request):
    username = request.user.username
    uInfo = getUInfo(username)
    cart = getCart(uInfo)

    if request.method == 'GET':
        serializer = DressSerializer(cart.dressesAdded, many=True)  
        return Response(serializer.data)
    
    if request.method == 'PUT':
        if cart.dressesAdded.all().count() < 5:
            dressObj = Dress.objects.get(id = request.data['dressToAdd'])
            cart.dressesAdded.add(dressObj)
            cart.save()
        else:
            dressObj = Dress.objects.get(id = request.data['dressToAdd'])
            cart.dressesLiked.add(dressObj)
            cart.save()

        serializer = DressSerializer(cart.dressesAdded, many=True)  
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    elif request.method == 'DELETE':
        dressObj = Dress.objects.get(id = request.data['dressToDelete'])
        cart.dressesAdded.remove(dressObj)
        cart.save()
        serializer = DressSerializer(cart.dressesAdded, many=True)  
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view((['GET', 'PUT', 'DELETE']))
@login_required
def getOrUpdate_favorite(request):
    username = request.user.username
    uInfo = getUInfo(username)
    userFavorites = getCart(uInfo)

    if request.method == 'GET':
        serializer = DressSerializer(userFavorites.dressesLiked, many=True)     
        return Response(serializer.data)
 
    elif request.method == 'PUT':
        dressObj = Dress.objects.get(id = request.data['dressToAdd'])
        userFavorites.dressesLiked.add(dressObj)
        userFavorites.save()
        serializer = DressSerializer(userFavorites.dressesLiked, many=True)  
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    elif request.method == 'DELETE':
        dressObj = Dress.objects.get(id = request.data['dressToDelete'])
        userFavorites.dressesLiked.remove(dressObj)
        userFavorites.save()
        serializer = DressSerializer(userFavorites.dressesLiked, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view((['POST']))
@login_required
def getAvailableForTrial(request):
    uname = request.user.username
    uInfo = getUInfo(uname)

    # If trial is already scheduled
    try: 
        alreadyScheduled = Alerts.objects.get(user=uInfo)
        date_obj = dt.strptime(str(alreadyScheduled.trialDateAndTime), '%m/%d/%y %I:%M %p')

        # Expire the trial if outdated
        if  dt.now() > date_obj:
            alreadyScheduled.delete()
            return getAvailableForTrial(request)
        else:
            return Response({'valid': 'false'})

    # If the they haven't scheduled their trial yet
    # Show them the dresses they that are available at their specified date
    except Alerts.DoesNotExist:

        
        # Get the three day window that they are trying to book
        userRentalDate_obj = dt.strptime(request.data['rentalDate'], '%m/%d/%Y')
        d1 = userRentalDate_obj.strftime('%m/%d/%y')
        d2 = (userRentalDate_obj + datetime.timedelta(days=1)).strftime('%m/%d/%y')
        d3 = (userRentalDate_obj + datetime.timedelta(days=-1)).strftime('%m/%d/%y')
        dateWindow = [d1, d2, d3]

        # Get the dresses they are trying to book
        tentative_Dresses = []
        cart = Carts.objects.get(user=uInfo)
        dresses = cart.dressesAdded.all()
        for DressObj in dresses:
            booked = DressObj.unavailableDates
            if any(x in booked for x in dateWindow):
                continue
            serializer = DressSerializer(DressObj) 
            tentative_Dresses.append(serializer.data)
        
        newDict.update({'valid': 'true', 'dresses': tentative_Dresses})
        return Response(newDict)

@api_view((['GET']))
@login_required
def getAvailableTimes(request):
    # Here is where you need to:
    # Pull times from google calendar labeled pressToDress pickup
    # Show the user options for the next two days
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    token_file = os.path.join(BASE_DIR, 'tables/token.pickle')
    if os.path.exists(token_file):
        with open(token_file, 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('calendar', 'v3', credentials=creds)

    # Call the Calendar API
    now = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
    events_result = service.events().list(calendarId='primary', timeMin=now,
                                        maxResults=10, singleEvents=True,
                                        orderBy='startTime').execute()
    events = events_result.get('items', [])

    slots = []
    for event in events:
        startString = event['start'].get('dateTime')
        endString = event['end'].get('dateTime')
        eventSummary = event['summary']
        temp = eventSummary.split("-")
        if len(temp) == 2:
            eventType = temp[0]
            eventInCharge = temp[1]
        else:
            continue
        start_time_obj = dt.strptime(startString, '%Y-%m-%dT%H:%M:%S-05:00')
        end_time_obj = dt.strptime(endString, '%Y-%m-%dT%H:%M:%S-05:00')
        now = dt.now().strftime("%Y-%m-%d %H:%M:%S")
        
        if  start_time_obj <= (dt.now() + datetime.timedelta(days=7)) and eventType == "Incharge":
            slot = start_time_obj
            while slot < end_time_obj:
                slots.append({"DateTime": slot, "PersonIncharge": eventInCharge})
                slot = slot + datetime.timedelta(minutes=30)
    serializer = AvailableTimesSerializer(slots, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view((['GET', 'PUT', 'DELETE']))
@login_required
def getOrUpdate_Alerts(request):
    uname = request.user.username
    uInfo = getUInfo(uname)

    if request.method == 'GET':
        try: 
            trial = Alerts.objects.get(user=uInfo)
            serializer = AlertsSerializer(trial, context={'request': request})
            return Response(serializer.data)
        except Alerts.DoesNotExist: 
            return Response({}, status=status.HTTP_204_NO_CONTENT)

    if request.method == 'PUT':
        try: 
            trial = Alerts.objects.get(user=uInfo)
            serializer = AlertsSerializer(trial, context={'request': request})
            return Response(serializer.data)
        except Alerts.DoesNotExist: 
            newTrial = Alerts.objects.create(
                user = uInfo
                )
            newTrial.trialDateAndTime = request.data['DateTime']
            newTrial.dateNeeded = request.data['RentalDate']
            cart = Carts.objects.get(user=uInfo)
            dresses = request.data['Dresses']
            for dress in dresses:
                dressObj = Dress.objects.get(id = int(dresses[dress]['id']))
                if dressObj.unavailableDates == "None":
                    dressObj.unavailableDates = request.data['RentalDate']
                else:
                    dressObj.unavailableDates = dressObj.unavailableDates  + " " + request.data['RentalDate']
                dressObj.save()

                newTrial.dressesSelected.add(dressObj)
                cart.dressesAdded.remove(dressObj)

            newTrial.save()
            cart.save()
            emailId = uInfo.email

            send_email_create(uname, emailId, newTrial, request.data['PersonIncharge'])
            serializer = AlertsSerializer(newTrial, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    if request.method == 'DELETE':
        try: 
            trial = Alerts.objects.get(user=uInfo)
        except:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
        send_email_delete(trial.eventId)
        trial.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view((['GET', 'PUT']))
@login_required
def getOrUpdate_userInfo(request):
    uname = request.user.username
    uInfo = getUInfo(uname)

    if request.method == 'GET':
        serializer = UInfoSerializer(uInfo, context={'request': request})     
        return Response(serializer.data)
 
    elif request.method == 'PUT':
        uInfo.gender = request.data['gender']
        uInfo.email = request.data['email']
        uInfo.phone = request.data['phone']
        sizes = request.data.getlist('sizes[]')
        s = ""
        for c in sizes:
            s = s  + c + " "
        uInfo.size = sizes
        uInfo.save()

        serializer = UInfoSerializer(uInfo, context={'request': request})  
        return Response(serializer.data, status=status.HTTP_201_CREATED)


def getUInfo(uname):
    try:
        uInfo = UserInfo.objects.get(username=uname)
    except UserInfo.DoesNotExist:
        uInfo = UserInfo.objects.create(
            username = uname,
            email = str(uname) + "@princeton.edu"
            )
        uInfo.save()
    return uInfo



@api_view(['GET'])
@login_required
def getRentalHistory(request):
    uname = request.user.username
    uInfo = getUInfo(uname)
    cart = getCart(uInfo)

    toSend0 = []
    try:
        trial = Alerts.objects.get(user=uInfo)
        dateTimeObj = dt.strptime(trial.trialDateAndTime, '%m/%d/%y %I:%M %p')
        date = dateTimeObj.strftime('%m/%d/%y')
        time = dateTimeObj.strftime('%I:%M %p')
        dresses = trial.dressesSelected.all()
        for dressObj in dresses:
            newDict = {"date": date}
            newDict.update({"time": time})
            newDict.update({"title": dressObj.title})
            newDict.update({"price": dressObj.price})
            toSend0.append(newDict)
    except Alerts.DoesNotExist: 
        toSend0 = []

    toSend2 = []
    toSend1 = []
    history = cart.rentalHistory.split(";")
    count = 0
    for entry in history:
        temp = entry.split()
        if len(temp) == 0:
            return Response({'trial': toSend0, 'pastHistory': {}, 'upcomingHistory': {}})
        rentalDateObj = dt.strptime(temp[0],  '%m/%d/%y')
        dressObj = Dress.objects.get(id = temp[1])
        newDict = {"Date": rentalDateObj.strftime('%m/%d')}
        serializer = DressSerializer(dressObj)
        newDict.update(serializer.data)
        if  rentalDateObj > dt.now() - datetime.timedelta(days = 1):
            toSend2.append(newDict)
        else:
            toSend1.append(newDict)
        count += 1

    return Response({'trial': toSend0, 'pastHistory': toSend1, 'upcomingHistory': toSend2})


# Internal use method
def send_email_create(uname, userEmailId, trialObj, personIncharge):
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('calendar', 'v3', credentials=creds)

    start_dateTime_obj = dt.strptime(str(trialObj.trialDateAndTime), '%m/%d/%y %I:%M %p')
    end_dateTime_obj = start_dateTime_obj + datetime.timedelta(minutes = 30)


    start_dateTime_str = start_dateTime_obj.strftime("%Y-%m-%dT%H:%M:%S-05:00")
    end_dateTime_str = end_dateTime_obj.strftime("%Y-%m-%dT%H:%M:%S-05:00")

    event = {
    'summary': 'Press To Dress Trial for ' + str(uname),
    'location': '34 Chamber Street, Princeton, NJ, 08544',
    'description': 
    'Your Press To Dress trial has been confirmed! Take a second to RSVP to this invite, so our team can assist you better. Happy Shopping!\nIf you want to cancel this trial please click <a href="https://localhost:3000/orders">here</a>.',
    'start': {
    'dateTime': start_dateTime_str,
    'timeZone': 'America/New_York',
    },
    'end': {
    'dateTime': end_dateTime_str,
    'timeZone': 'America/New_York',
    },
    'attendees': [
        {'email': userEmailId},
        {'email': str(personIncharge) + '@princeton.edu'}
    ],
    'reminders': {
    'useDefault': False,
    'overrides': [
      {'method': 'email', 'minutes': 24 * 60},
      {'method': 'popup', 'minutes': 10},
    ],
    },
    }
    event = service.events().insert(calendarId='primary', body=event, sendUpdates= "all").execute()
    trialObj.eventId = event['id']
    trialObj.save()
    return

# Custom Filter for dresses
def CustomFilter(myDict):
    dress_filter = Dress.objects.all().order_by('id')
    for key in myDict:
        if key == 'occasion':
            dress_filter = dress_filter.filter(reduce(operator.or_, [Q(occasions__icontains= x + ' ') for x in myDict[key]]))
        elif key == 'size':
            dress_filter = dress_filter.filter(reduce(operator.or_, [Q(size__icontains=x) for x in myDict[key]]))
        elif key == 'keyword':
            dress_filter = dress_filter.filter(reduce(operator.or_, [Q(description__icontains=' ' + x.lower()) for x in myDict[key]]))
        else:
            dress_filter = dress_filter.filter(price__lte = myDict[key])
    return dress_filter


def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})


# Method that returns the number of dresses in the cart
@api_view(['GET'])
def getNumberInCart(myDict):
    username = request.user.username
    uInfo = getUInfo(username)
    cart = getCart(uInfo)
    if cart.dressesAdded != None:
        return Response({'NumberInCart': cart.dressesAdded.all().count()})
    return Response({'numberInCart': 0})


# Method that returns the number of orders
@api_view(['GET'])
def getNumberDressesRented(request):
    username = request.user.username
    uInfo = getUInfo(username)
    return Response({'numberRented': uInfo.numberRented}, status=status.HTTP_200_OK)

def getCart(uInfoObject):
    try:
        cart = Carts.objects.get(user=uInfoObject)
    except Carts.DoesNotExist:
        cart = Carts.objects.create(
            user = uInfoObject
            )
        cart.save()
    return cart


# Internal use method
def send_email_delete(eid):
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('calendar', 'v3', credentials=creds)
    try:
        service.events().delete(calendarId='primary', eventId=eid, sendUpdates= "all").execute()
        return
    except:
        return




    







