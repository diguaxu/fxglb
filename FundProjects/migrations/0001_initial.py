# Generated by Django 2.2 on 2020-10-15 10:41

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='fundBasicInfo',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateField(auto_now=True, verbose_name='数据日期')),
                ('pass_date', models.DateField(auto_now=True, verbose_name='总办会通过日期')),
                ('project_name', models.CharField(max_length=255, verbose_name='产品名称')),
                ('status', models.IntegerField(choices=[(0, '已结束'), (1, '未结束')], default=1, verbose_name='状态')),
            ],
            options={
                'db_table': 'fundBasicInfo',
            },
        ),
        migrations.CreateModel(
            name='fundPnlInfo',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateField(auto_now=True, verbose_name='数据日期')),
                ('project_name', models.CharField(max_length=255, verbose_name='产品名称')),
                ('day_pnl', models.DecimalField(decimal_places=5, default=0, max_digits=5, verbose_name='当日总盈亏')),
                ('day_pnl_securityalgorithm', models.DecimalField(decimal_places=5, default=0, max_digits=5, verbose_name='当日总盈亏证券算法')),
                ('var', models.DecimalField(decimal_places=5, default=0, max_digits=5, verbose_name='VaR')),
            ],
            options={
                'db_table': 'fundPnlInfo',
            },
        ),
    ]