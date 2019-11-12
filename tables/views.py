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
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from rest_framework.decorators import api_view, renderer_classes


# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/calendar.events']

# Confirm stuff here 
# Make sure this works for all dresses 
# @login_required

# occasion list of occasion
# size list of size
# price number 
# keyword list of strings

@api_view((['GET', 'POST']))
def dress_list(request):
    """
    List of dresses according to the search request passed
    """
    # Get dress list using filter and tssearch
    # Apply other filters
    # Serialize return query set
    # Right now this is using old search method
    # See if you can use tssearch for better searches
    if request.method == 'GET':
        dress_filter = Dress.objects.all().order_by('id')
        serializer = DressSerializer(dress_filter, many=True) 
        return Response(serializer.data, status=status.HTTP_200_OK, template_name=None)
    elif request.method == 'POST':
        dress_filter = CustomFilter(request.data)
        serializer = DressSerializer(dress_filter, many=True) 
        return Response(serializer.data, status=status.HTTP_200_OK, template_name=None)
    return Response({}, status=status.HTTP_400_BAD_REQUEST)

@api_view((['GET', 'PUT', 'DELETE']))
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
        # Allow only 5 dresses in each user's cart
        if cart.dressesAdded.all().count() < 5:
            dressObj = Dress.objects.get(id = request.PUT['dressToAdd'])
            cart.dressesAdded.add(dressObj)
            cart.save()

        serializer = DressesSerializer(cart.dressesAdded, context={'request': request})  
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Check if delete can be a method
    # refer to Digital ocean link
    elif request.method == 'DELETE':
        dressObj = Dress.objects.get(id = request.DELETE['dressToDelete'])
        cart.dressesAdded.remove(dressObj)
        cart.save()
        serializer = DressesSerializer(cart.dressesAdded, context={'request': request})  
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view((['GET', 'PUT', 'DELETE']))
@login_required
def getOrUpdate_favorite(request):
    # The given username should exist in the favorites table
    username = request.user.username
    try:
        userFavorites= Carts.objects.get(user=username)
    except Carts.DoesNotExist:
        # if no dress is liked, create an empty favorites cart
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

    # Check if delete can be a method
    # refer to 
    elif request.method == 'DELETE':
        dressObj = Dress.objects.get(id = request.DELETE['dressToDelete'])
        userFavorites.dressesAdded.remove(dressObj)
        userFavorites.save()
        serializer = DressesSerializer(userFavorites.dressesLiked, context={'request': request})
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view((['GET']))
@login_required
def get_AvailableForTrial(request):
    # return the cart if the request is a GET request
    uname = request.user.username

    # If trial is already scheduled tell the user that the trial is scheduled
    # and that they have an upcoming trial
    try: 
        alreadyScheduled = Alerts.objects.get(user=uname)

        # Convert into MM/DD/YY format
        # Date object only
        date_obj = dt.strptime(str(alreadyScheduled.trialDateAndTime), '%m/%d/%y %H:%M')

        # Expire the trial if outdated
        if  dateTime_obj > dt.now():
            alreadyScheduled.delete()
            # the function calls itself
            return getOrUpdate_ForTrial(request)
        # don't let them schedule two trials for the same day
        elif date_obj.strftime('%m/%d/%y') == userRentalDate_obj:
            # send the existing trial details
            serializer = AlertsSerializer(alreadyScheduled, context={'request': request})
            if serializer.is_valid():
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # If the they haven't scheduled their trial yet
    # Show them the dresses they that are available at their specified date
    except Alerts.DoesNotExist:

        # Get the three day window that they are trying to book
        userRentalDate_obj = dt.strptime(request.GET['RentalDate'], '%m/%d/%y')
        d1 = userRentalDate_obj.strftime('%m/%d/%y')
        d2 = (userRentalDate_obj + datetime.timedelta(days=1)).strftime('%m/%d/%y')
        d3 = (userRentalDate_obj + datetime.timedelta(days=-1)).strftime('%m/%d/%y')
        dateWindow = [d1, d2, d3]

        # Get the dresses they are trying to book
        cart = Carts.objects.get(user=uname)

        tentativeDresses = []
        for DressObj in cart.dressesAdded:
            booked = DressObj.unavailableDates
            # if there is any overlap with existing tentative bookings for that dress
            # don't book
            if any(x in booked for x in dateWindow):
                continue
            tentativeDresses.append(DressObj)

        # return the available dresses
        serializer = DressesSerializer(tentativeDresses, context={'request': request})  
        if serializer.is_valid():
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@login_required
def getAvailableTimes(request):
    # Here is where you need to:
    # Pull times from google calendar labeled pressToDress pickup
    # Show the user options for the next two days
    """Shows basic usage of the Google Calendar API.
    Prints the start and name of the next 10 events on the user's calendar.
    """
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
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

    # Call the Calendar API
    now = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
    print('Getting the upcoming 10 events')
    events_result = service.events().list(calendarId='primary', timeMin=now,
                                        maxResults=10, singleEvents=True,
                                        orderBy='startTime').execute()
    events = events_result.get('items', [])

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
        
        slots = []
        if  start_time_obj <= dt.now() + datetime.timedelta(days=2) and eventType == "Pick up time":
            slot = start_time_obj
            while slot < end_time_obj:
                slots.append({"DateTime": slot, "PersonIncharge": eventInCharge})
                slot = slot + datetime.timedelta(minutes=30)

        # Serialize the time slots found into json and return response
        serializer = AvailableTimesSerializer(slots, many=True)
        if serializer.is_valid():
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view((['GET', 'PUT', 'DELETE']))
@login_required
def getOrUpdate_Alerts(request):
    if request.method == 'GET':
        try: 
            trial = Alerts.objects.get(user=uname)
            serializer = AlertsSerializer(trial, context={'request': request})
            if serializer.is_valid():
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Alerts.DoesNotExist: 
            # return empty response
            return Response(status=status.HTTP_204_NO_CONTENT)


    if request.method == 'PUT':

        newTrial = Alerts.objects.create(
            user = username
            )

        # Request format '10/25/06 14:30'
        newTrial.trialDateAndTime = request.PUT['DateTime']

        # Get the associated cart object
        cart = Carts.objects.get(user=uname)


        # The request will contain the list of dresses the user wants to book for trial
        for dressId in request.PUT['dresses']:
            dressObj = Dress.objects.get(id = dressId)

            # RentalDate must be passed in the request in MM/DD/YY format
            dressObj.unavailableDates.append(";" + request.PUT['RentalDate'])
            dressObj.save()

            # The entries must be added with the specificied date and time in Alerts
            newTrial.dressesSelected.add(dressObj)

            # The entries must be removed from the users cart
            cart.dressesAdded.remove(dressObj)

        newTrial.save()
        cart.save()

        # Get the user info if exists
        # Create the user info object if not
        try:
            uInfo = UserInfo.objects.get(user=uname)
        except UserInfo.DoesNotExist:
            uInfo = UserInfo.objects.create(
            username = uname,
            email = str(uname) + "@princeton.edu"
            )
            uInfo.save()

        emailId = uInfo.email

        send_email_create(uname, emailId, newTrial, request.PUT['PersonIncharge'])
        serializer = AlertsSerializer(newTrial, context={'request': request})
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Handling cancellations
    # User manually cancels trial
    if request.method == 'DELETE':
        try: 
            trial = Alerts.objects.get(user=uname)
        except:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        # Delete this trial 
        trial.delete()
            
        uInfo = UserInfo.objects.get(user=uname)
        emailId = uInfo.email
        # Send email push to cancel the event
        send_email(emailId, trial, request.PUT['PersonIncharge'], False)
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view((['GET', 'PUT']))
@login_required
def getOrUpdate_userInfo(request):
    # The given username should exist in the favorites table
    uname = request.user.username
    try:
        uInfo = UserInfo.objects.get(user=uname)
    except UserInfo.DoesNotExist:
        # if no dress is liked 
        uInfo = UserInfo.objects.create(
            username = uname,
            email = str(uname) + "@princeton.edu"
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

@api_view(['GET'])
@login_required
def get_rentalHistory(request):
    uname = request.user.username
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

    toSerialize = []
    history = cart.rentalHistory.split(";")
    for entry in history:
        temp = entry.split()
        rentalDateObj = dt.strptime(temp[0],  '%m/%d/%y')
        dressObj = Dress.objects.get(id = temp[1])
        toSerialize.append({"Date": rentalDateObj, "RentedDress": dressObj})


    serializer = RentalHistorySerializer(toSerialize, many=True)
    if serializer.is_valid():
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Internal use method
def send_email_create(uname, userEmailId, trialObj, personIncharge):
    # This should create a markup of the trial event
    # The trial event should include location, username
    # time, dresses booked for trial
    # This event should be pushed in the form of an invite.ics
    # to the user's preferred email
    start_dateTime_obj = dt.strptime(str(trialObj.trialDateAndTime), '%m/%d/%y %H:%M')
    end_dateTime_obj = start_dateTime_obj + datetime.timedelta(minutes = 30)


    start_dateTime_str = start_dateTime_obj.strftime("%Y-%m-%dT%H:%M:%S-05:00")
    end_dateTime_str = end_dateTime_obj.strftime("%Y-%m-%dT%H:%M:%S-05:00")

    event = {
    'summary': 'Press To Dress Trial for ' + str(uname),
    'location': '34 Chamber Street, Princeton, NJ, 08544',
    'description': 
    'Your Press To Dress trial has been confirmed! Take a second to RSVP to this invite, so our team can assit you better. Happy Shopping!',
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
    event = service.events().insert(calendarId='primary', body=event, sendNotifications= True).execute()
    return

# Custom Filter for dresses
def CustomFilter(myDict):
    print(myDict)
    dress_filter = Dress.objects.all().order_by('id')
    for key in myDict:
        if key == 'occasion' or key == 'ocassion':
            dress_filter = dress_filter.filter(reduce(operator.or_, [Q(occasions__contains=x) for x in myDict[key]]))
        elif key == 'size':
            dress_filter = dress_filter.filter(reduce(operator.or_, [Q(size__contains=x) for x in myDict[key]]))
        elif key == 'keyword':
            dress_filter = dress_filter.filter(reduce(operator.or_, [Q(description__contains=x.lower()) for x in myDict[key]]))
        else:
            dress_filter = dress_filter.filter(price__lte = myDict[key])
    return dress_filter



