# Generated by Django 3.2.2 on 2021-09-29 02:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('report', '0008_alter_pioneer_auxi_pioneer'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='report',
            name='hours',
        ),
    ]
