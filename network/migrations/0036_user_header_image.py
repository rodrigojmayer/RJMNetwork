# Generated by Django 4.0.4 on 2022-06-05 00:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0035_alter_likers_liker'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='header_image',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
    ]
