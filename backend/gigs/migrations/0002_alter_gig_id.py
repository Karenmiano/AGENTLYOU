# Generated by Django 5.2.1 on 2025-05-20 15:13

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gigs', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gig',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]
