from django.contrib import admin

from apis.models import Classroom, School, Student, Teacher


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'abbreviation')
    search_fields = ('name', 'abbreviation')


@admin.register(Classroom)
class ClassroomAdmin(admin.ModelAdmin):
    list_display = ('id', 'school', 'grade', 'room')
    list_filter = ('school', 'grade')
    list_select_related = ('school',)


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'gender')
    list_filter = ('gender',)
    search_fields = ('first_name', 'last_name')
    filter_horizontal = ('classrooms',)


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'gender', 'classroom')
    list_filter = ('gender', 'classroom__school')
    search_fields = ('first_name', 'last_name')
    list_select_related = ('classroom', 'classroom__school')
