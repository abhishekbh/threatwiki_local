from django.conf.urls.defaults import *

# admin module
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    #backend
    url(r'^admin/', include(admin.site.urls)),

    #ws
    (r'^correlate', 'backend.ews.views.correlate'),
    (r'^req_dpt', 'backend.ews.views.req_dpt'),
    (r'^req', 'backend.ews.views.req'),

    #frontend
    (r'^index', 'backend.ews.views.index'),
    (r'^soc/(?P<soc_id>\d+)/$', 'backend.ews.views.threatwiki'),
    (r'^datapoint/(?P<datapoint_id>\d+)/$', 'backend.ews.views.detail'),
    (r'^', 'backend.ews.views.index'),
)
