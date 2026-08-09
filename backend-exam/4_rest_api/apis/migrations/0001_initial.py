import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='School',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255, unique=True)),
                ('abbreviation', models.CharField(max_length=20, unique=True)),
                ('address', models.TextField()),
            ],
            options={
                'ordering': ('name',),
            },
        ),
        migrations.CreateModel(
            name='Classroom',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('grade', models.PositiveSmallIntegerField()),
                ('room', models.PositiveSmallIntegerField()),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='classrooms', to='apis.school')),
            ],
            options={
                'ordering': ('school', 'grade', 'room'),
            },
        ),
        migrations.CreateModel(
            name='Teacher',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('first_name', models.CharField(max_length=150)),
                ('last_name', models.CharField(max_length=150)),
                ('gender', models.CharField(choices=[('male', 'ชาย'), ('female', 'หญิง'), ('other', 'อื่น ๆ')], max_length=10)),
                ('classrooms', models.ManyToManyField(blank=True, related_name='teachers', to='apis.classroom')),
            ],
            options={
                'ordering': ('first_name', 'last_name'),
            },
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('first_name', models.CharField(max_length=150)),
                ('last_name', models.CharField(max_length=150)),
                ('gender', models.CharField(choices=[('male', 'ชาย'), ('female', 'หญิง'), ('other', 'อื่น ๆ')], max_length=10)),
                ('classroom', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='students', to='apis.classroom')),
            ],
            options={
                'ordering': ('first_name', 'last_name'),
            },
        ),
        migrations.AddConstraint(
            model_name='classroom',
            constraint=models.UniqueConstraint(fields=('school', 'grade', 'room'), name='unique_classroom_per_school'),
        ),
        migrations.AddIndex(
            model_name='teacher',
            index=models.Index(fields=['last_name'], name='teacher_last_name_idx'),
        ),
        migrations.AddIndex(
            model_name='teacher',
            index=models.Index(fields=['gender'], name='teacher_gender_idx'),
        ),
        migrations.AddIndex(
            model_name='student',
            index=models.Index(fields=['last_name'], name='student_last_name_idx'),
        ),
        migrations.AddIndex(
            model_name='student',
            index=models.Index(fields=['gender'], name='student_gender_idx'),
        ),
    ]
