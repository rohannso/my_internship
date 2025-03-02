# Generated by Django 5.0.6 on 2025-01-14 03:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app1", "0003_familyhistory"),
    ]

    operations = [
        migrations.CreateModel(
            name="DietHistory",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("sour_foods", models.JSONField()),
                ("salty_foods", models.JSONField()),
                ("processed_foods", models.JSONField()),
                ("incompatible_combinations", models.JSONField()),
                ("food_habits", models.JSONField()),
                ("oily_foods", models.JSONField()),
                (
                    "meals_before_digestion",
                    models.CharField(
                        choices=[("Yes", "Yes"), ("No", "No")], max_length=3
                    ),
                ),
                ("diet_score", models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name="LifestyleAssessment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("suppress_urges", models.IntegerField(default=0)),
                ("heavy_exercise", models.IntegerField(default=0)),
                ("sleep_after_meal", models.IntegerField(default=0)),
                ("day_sleep", models.IntegerField(default=0)),
                ("exhausted", models.IntegerField(default=0)),
                ("insomnia", models.IntegerField(default=0)),
                ("workout_after_meal", models.IntegerField(default=0)),
                ("heavy_food_after_fasting", models.IntegerField(default=0)),
                ("cold_bath", models.IntegerField(default=0)),
                ("eat_with_fear", models.IntegerField(default=0)),
                ("total_score", models.IntegerField(default=0)),
            ],
        ),
    ]
