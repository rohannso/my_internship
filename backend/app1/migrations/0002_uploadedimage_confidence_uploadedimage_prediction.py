# Generated by Django 5.0.6 on 2025-01-09 06:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app1", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="uploadedimage",
            name="confidence",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="uploadedimage",
            name="prediction",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
