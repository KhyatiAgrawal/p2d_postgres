# Generated by Django 2.0.13 on 2019-11-11 05:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tables', '0003_auto_20191111_0006'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='carts',
            name='upcomingRentals',
        ),
        migrations.RemoveField(
            model_name='userinfo',
            name='dressesRented',
        ),
        migrations.RemoveField(
            model_name='carts',
            name='rentalHistory',
        ),
        migrations.AddField(
            model_name='carts',
            name='rentalHistory',
            field=models.CharField(default='', max_length=1000),
        ),
    ]
