from django.db import models

class Soc(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=1000)
    background = models.TextField(max_length=10000)

    # For admin site 
    def __unicode__(self):
        return self.title
    
class Location(models.Model):
    title = models.CharField(max_length=100)
    coordinates = models.CharField(max_length=100)
   
    # For admin site 
    def __unicode__(self):
        return self.title

class Tag(models.Model):
    title = models.CharField(max_length=100)
    soc = models.ForeignKey(Soc)
    alwaysoccurswith = models.ManyToManyField('self', blank=True)

# For admin site 
    def __unicode__(self):
        return self.soc.title + " - " + self.title


class Datapoint(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    date_added = models.DateTimeField(auto_now_add = True)
    location = models.ForeignKey(Location)
    soc = models.ForeignKey(Soc)
    tags = models.ManyToManyField(Tag)
    start_date = models.DateField()
    end_date = models.DateField()

    def getDescription(self):
        return self.description
    
    # For admin site 
    def __unicode__(self):
        return self.title
    
class Link(models.Model):
    url = models.CharField(max_length=500)
    datapoint = models.ForeignKey(Datapoint)
    
    # For admin site 
    def __unicode__(self):
        return self.url
