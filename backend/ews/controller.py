from backend.ews.models import *

def combinations(iterable, r):
    # combinations('ABCD', 2) --> AB AC AD BC BD CD
    # combinations(range(4), 3) --> 012 013 023 123
    pool = tuple(iterable)
    n = len(pool)
    if r > n:
        return
    indices = range(r)
    yield tuple(pool[i] for i in indices)
    while True:
        for i in reversed(range(r)):
            if indices[i] != i + n - r:
                break
        else:
            return
        indices[i] += 1
        for j in range(i+1, r):
            indices[j] = indices[j-1] + 1
        yield tuple(pool[i] for i in indices)
        
def correlate_fn(soc_id):

    tag_sort = {'tags':[]}
    tag_list = {'tags':[]}
    correls = {}
    pair_counts= {'pairs':[]}
    
    debug = ""
    
    dataset = Datapoint.objects.filter(soc = soc_id)
    tags = Tag.objects.filter(soc = soc_id)
    
    for t in tags:
        tag_sort['tags'].append(str(t.id))
        tag_list['tags'].append({'id':str(t.id),'title':str(t.title) })
    
    tag_subpairs = list(combinations(tag_sort['tags'], 2))
    
    for p in tag_subpairs:
        correls[p] = {'id':p, 'count':0}                    

    for d in dataset:
        
        tag_sort = {'tags':[]}
        tag_subpairs_d = ''
        
        for t in d.tags.all():
            tag_sort['tags'].append(str(t.id))
            
        tag_subpairs_d = list(combinations(tag_sort['tags'], 2))
        
        for p in tag_subpairs_d:
            try:
            	correls[p]['count'] = correls[p]['count'] + 1
            except KeyError:
				#TODO: need to fix this	           
	            #correls[(p]['count'] = correls[p]['count'] + 1
            	pass  
    
    for x in correls:
        pair_counts['pairs'].append({'id':[correls[x]['id'][0],correls[x]['id'][1]],'count':correls[x]['count']})
    
    final_output = str([tag_list,pair_counts])
    return final_output

def tag_correlate_fn(soc_id, key_tag_id): 
    # Pull all tags for this soc
    # Run through each tag and count up number of datapoints with the passed in tag and the current tag
    # Note this function is currently not being used - it was used originally when a user clicked on a tag on the timeline 
    # to load up all dpts related to the clicked tag + 5 other related tags - now I just show the dpts associated with the clicked on tag
    
    correls = {}
    all_tags = Tag.objects.filter(soc = soc_id).exclude(id = key_tag_id)
    
    for tag in all_tags:
        correls[str(tag.id)] = Datapoint.objects.filter(soc = soc_id).filter(tags__in = [tag.id]).filter(tags__in = [key_tag_id]).count()

    return correls
