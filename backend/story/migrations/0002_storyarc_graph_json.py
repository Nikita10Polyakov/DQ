# Generated by Django 5.2.2 on 2025-06-08 11:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('story', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='storyarc',
            name='graph_json',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
