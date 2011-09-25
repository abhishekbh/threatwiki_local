from backend.ews.models import Soc, Tag, Location, Datapoint, Link
from django.http import HttpResponseRedirect, HttpResponse
from django.template import Context, loader

##################################################################
from django.core import serializers
from django.db.models import Q
from django.utils import simplejson

import datetime
import calendar
from operator import itemgetter

from backend.ews.controller import *
##################################################################

def index(request):
    soc_list = Soc.objects.all()
    t = loader.get_template('index.html')
    c = Context({
        'soc_list': soc_list,
    })
    return HttpResponse(t.render(c))

def threatwiki(request, soc_id):
    soc_info = Soc.objects.filter(id=soc_id)
    datapoint_list = Datapoint.objects.filter(soc=soc_id)
    t = loader.get_template('threatwiki.html')
    c = Context({
        'soc_info' : soc_info,
        'datapoint_list': datapoint_list,
    })
    return HttpResponse(t.render(c))

def detail(request, datapoint_id):
    datapoint = Datapoint.objects.filter(id=datapoint_id)
    t = loader.get_template('detail.html')
    c = Context({
        'datapoint': datapoint,
    })
    return HttpResponse(t.render(c))

#############################################################

def req(request):
#Sends a list of datapoints to the SOC page within a specific 3 month time period. It filters datapoints either by a default set of tags, or the tag sent in from the client + 5 of the most correlated tags to that tag
    output = ""
    if request.REQUEST.get("soc") and request.REQUEST.get("year") and request.REQUEST.get("month"):
        
        req_soc = int(request.REQUEST.get("soc"))
        final_output = {'datapoints':[], 'tags':[]}
        start_range = datetime.date(int(request.REQUEST.get("year")), int(request.REQUEST.get("month")), 1)
        
        end_year = int(request.REQUEST.get("year"))
        end_month = int(request.REQUEST.get("month")) + 4
        
        if end_month > 12:
            end_year = end_year + 1
            end_month = end_month - 12

        end_range = datetime.date(end_year, end_month, calendar.mdays[end_month])
        
        output = Datapoint.objects.filter(soc = int(request.REQUEST.get("soc")))
        tags = Tag.objects.filter(soc = int(request.REQUEST.get("soc")))
        
        if request.REQUEST.get("type") == 'default':
            tag_filters = [
                           Tag.objects.get(title='General', soc=req_soc).id, 
                           Tag.objects.get(title='Symbolization', soc=req_soc).id, 
                           Tag.objects.get(title='Dehumanization', soc=req_soc).id,
                           Tag.objects.get(title='Organization', soc=req_soc).id,
                           Tag.objects.get(title='Polarization', soc=req_soc).id,
                           Tag.objects.get(title='Preparation', soc=req_soc).id,
                           Tag.objects.get(title='Extermination', soc=req_soc).id,
                           Tag.objects.get(title='Denial', soc=req_soc).id
                           ]
            output = output.filter(tags__in= tag_filters).distinct()
            tags = tags.filter(id__in = tag_filters).distinct()
            
            for t in tags:
                final_output['tags'].append(t.title.encode("utf-8"))
        
        if request.REQUEST.get("type") == 'specific':
            
            req_tag = request.REQUEST.get("tag")
            
            #TODO: investigate security issues with this - we're directly passing in user input to a DB lookup
            tag_id = Tag.objects.get(id=long(req_tag), soc=req_soc).id
            tag_title = Tag.objects.get(id=long(req_tag), soc=req_soc).title
            
            tag_filters = [tag_id]
            tag_list = [tag_title]
            
            # Pick top 5 w/ count over 0
            
            #correlation_count = tag_correlate_fn(int(request.REQUEST.get("soc")), tag_id)
            #correlation_count = sorted(correlation_count.items(), key=itemgetter(1), reverse = True)
            
            #for x in range(5):  
            #   if correlation_count[x][1] >= 0:
            #      tag_filters.append(int(correlation_count[x][0]))
            #     tag_list.append(Tag.objects.get(id=int(correlation_count[x][0])).title)
            
            output = output.filter(tags__in= tag_filters).distinct()
            tags = tags.filter(id__in = tag_filters).distinct()
            
            for t in tag_list:
                final_output['tags'].append(t.encode("utf-8"))
        
        output = output.filter(Q(start_date__range = (start_range, end_range)) | Q(end_date__range = (start_range, end_range)) | (Q(end_date__gt = end_range) & Q(start_date__lt = start_range)))
        
        for o in output:
            k = o.tags.all().values('title','id')
            for kx in k:
                kx['title'] = kx['title'].encode("utf-8")
                kx['id'] = unicode(kx['id']).encode("utf-8")
            final_output['datapoints'].append({'id':unicode(o.id).encode("utf-8"),'title':o.title.encode("utf-8"), 'tags': k, 'start_date': unicode(o.start_date).encode("utf-8"), 'end_date': unicode(o.end_date).encode("utf-8"), 'location':o.location.coordinates.encode("utf-8"), 'location_title':o.location.title.encode("utf-8")})
    
    return HttpResponse(str(final_output))

def req_dpt(request):
#Returns a specific datapoint - used when datapoint panel is opened 

    output = ""
    if request.REQUEST.get("id"):
        output = Datapoint.objects.get(id = int(request.REQUEST.get("id")))
        k = output.tags.all().values('title','id')
        for kx in k:
            kx['title'] = kx['title'].encode("utf-8")
            kx['id'] = unicode(kx['id']).encode("utf-8")
        final_output = {
                        
                        'description':unicode(output.description).encode("utf-8"), 
                        'title':output.title.encode("utf-8"),
                        'tags':k, 
                        'start_date': unicode(output.start_date).encode("utf-8"), 
                        'end_date': unicode(output.end_date).encode("utf-8"), 
                        'location':output.location.coordinates.encode("utf-8"), 
                        'location_title':output.location.title.encode("utf-8"),
                        'links':[]
                        }
        
        links = Link.objects.filter(datapoint = output)
        
        for l in links:
            final_output['links'].append(l.url.encode("utf-8"))
        
    return HttpResponse(str(final_output))

def correlate(request):
    final_output = correlate_fn(int(request.REQUEST.get("soc")))    
    return HttpResponse(str(final_output))

#############################################################
