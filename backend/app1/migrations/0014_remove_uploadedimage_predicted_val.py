# Generated by Django 5.0.6 on 2025-01-19 18:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("app1", "0013_uploadedimage_predicted_val"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="uploadedimage",
            name="predicted_val",
        ),
    ]
