from django.contrib import admin
from django import forms
from sp.ews.models import *

class DatapointAdmin(admin.ModelAdmin):
    list_display = ('title', 'soc', 'start_date', 'end_date')
    search_fields = ['soc__title']
    filter_horizontal = ('tags',)
    
class SocAdmin(admin.ModelAdmin):
    list_display = ('title', 'id')

admin.site.register(Soc, SocAdmin)
admin.site.register(Location)
admin.site.register(Tag)
admin.site.register(Datapoint,DatapointAdmin)
admin.site.register(Link)
