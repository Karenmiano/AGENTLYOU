# Generated by Django 5.2.1 on 2025-07-04 13:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_rename_state_province_location_state_region_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='country_code',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='location',
            name='state_region',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
