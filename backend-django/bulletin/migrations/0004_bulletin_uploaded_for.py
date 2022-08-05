# Generated by Django 3.2.2 on 2021-05-20 00:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bulletin', '0003_alter_bulletin_uploaded_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='bulletin',
            name='uploaded_for',
            field=models.CharField(choices=[('Announcement', 'Announcement'), ('Midweek Meeting Schedule', 'Midweek Meeting Schedule'), ('Field Service Schedule', 'Field Service Schedule'), ('Weekend Meeting Schedule', 'Weekend Meeting Schedule')], default='Announcement', max_length=50),
        ),
    ]