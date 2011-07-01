// ThreatWiki Prototype - Taneem Talukdar
// The Sentinel Project for Genocide Prevention
// May 2011

//**********************************************************************************//
// Setup
//**********************************************************************************//

// Adding some code to let me use indexOf to search arrays easily
// Credit: http://www.tutorialspoint.com/javascript/array_indexof.htm

if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

//**********************************************************************************//
// Timeline Tab
//**********************************************************************************//
	
	var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	
	var timeline_obj = new Object;
	var map_obj = new Object;
	
	function grid_load_data(month, year, tag){
	document.getElementById("top").innerHTML = "<img src='http://www.thesentinelproject.org/threatwiki/l.gif' /><strong> Generating... </strong>";
			
		var c = new XMLHttpRequest();
		if(tag){
			timeline_obj.context = tag;
			var req = 'http://threatwiki.thesentinelproject.org/req/?soc='+master_soc_id+'&year='+year+'&month='+month+'&type=specific&tag='+tag;
		}
		else{
			timeline_obj.context = 'default';
			var req = 'http://threatwiki.thesentinelproject.org/req/?soc='+master_soc_id+'&year='+year+'&month='+month+'&type=default';
		}
			
		c.open('GET',req, true);
		c.onreadystatechange = function(){
			if (c.readyState == 4) {
				dataset = eval("("+c.responseText+")");
				timeline_obj.dataset = dataset;
				timeline_obj.s_month = month;
				timeline_obj.s_year = year;
				
				timeline_obj.end_month = month +4;
				timeline_obj.end_year = timeline_obj.s_year;
				
				if(timeline_obj.end_month > 12){
					timeline_obj.end_year +=1;
					timeline_obj.end_month += -12;
				}  
				
				document.getElementById("top").innerHTML = ' ';
				
				if(tag){
					
					document.getElementById("top").innerHTML = '<div id="tag_filter" class="twiki_tag_filter"><div style="float:left;">Exploring events correlated to "'
					+ timeline_obj.dataset.tags[0]+'" </div><div style="float:right">[X]</div><div style="clear:both"></div></div>';
					
					document.getElementById("tag_filter").onmouseover = function(){document.getElementById("tag_filter").style.backgroundColor = "#E9E9E9"}; 
					document.getElementById("tag_filter").onmouseout = function(){document.getElementById("tag_filter").style.backgroundColor = "#EFEFEF"}; 
					document.getElementById("tag_filter").onclick = function(){grid_load_data(timeline_obj.s_month, timeline_obj.s_year);};
				}
				
				//Remove existing frame and build frame
				if (timeline_obj.paper != null){
					timeline_obj.paper.canvas.parentNode.removeChild(timeline_obj.paper.canvas);
					delete timeline_obj.paper;
					build_timeline();
				}
				else {
					build_frame();
					build_timeline();
				}
				
			}
		};
		c.send(null);
	}
	
	function build_frame(){
		
		var div_struct = "<div class='twiki_timeline_frame' id='timeline_frame'></div>";
		div_struct += "<div id='map_datapoint_frame'></div>";
		div_struct += "<div style='clear:both'></div>";
		div_struct += "<div class='twiki_single_datapoint_display' id='single_datapoint_display'></div>";
		
		document.getElementById('canvas_holder').innerHTML = div_struct;
				
		div_struct = "<div class='twiki_map_frame' id='map_frame' style='float:left'></div>";
		div_struct += "<div class='twiki_dtpt_list_frame' id='dtpt_list_frame' style='float:left'> </div>";
		
		document.getElementById('map_datapoint_frame').innerHTML = div_struct;
		
			}
	
	function build_timeline(){
		//Setup
		if(timeline_obj.dataset.datapoints.length > 0)
			document.getElementById('dtpt_list_frame').innerHTML = '';
		else
			document.getElementById('dtpt_list_frame').innerHTML = "<div style='color:#CCCCCC; margin-top:50%; margin-left:20%'>No recorded events in this time frame</div>";
		
		document.getElementById('single_datapoint_display').innerHTML ='';
		document.getElementById('single_datapoint_display').style.borderBottom ='none';
			
		var tag_dpt_ref = new Array();
		map_obj.markers = new Array();
		map_obj.marker_refs = new Array(); 
		map_obj.captions = new Array();
		map_obj.dpt_refs = new Array();
							
		//create and init a reference list of datapoints keyed to tags		
		for(var i=0; i<timeline_obj.dataset.tags.length; i++) {
			tag_dpt_ref[i] = new Array();
		}
		
		var infowindow_content = new Array();
		for(var i=0; i<timeline_obj.dataset.datapoints.length; i++) {
			for(var j=0; j<timeline_obj.dataset.datapoints[i].tags.length; j++) {
				//Check if the current tag for this dpt is part of the set that needs to actually be displayed
				if(timeline_obj.dataset.tags.indexOf(timeline_obj.dataset.datapoints[i].tags[j].title) != -1){
					tag_dpt_ref[timeline_obj.dataset.tags.indexOf(timeline_obj.dataset.datapoints[i].tags[j].title)].push(i);					
				}				
			}
			
			//Also use this loop to cycle through and add all the datapoints to the datapoint list frame and respective points to the map
			document.getElementById('dtpt_list_frame').innerHTML += "<div id=dpt_"+timeline_obj.dataset.datapoints[i].id+" class='twiki_dtpt_item' onMouseOver=(this.style.backgroundColor='#FBFBFB') onMouseOut=(this.style.backgroundColor='#FFF')>"
			+timeline_obj.dataset.datapoints[i].title.substring(0,30) + "...</div>";
			
			if(map_obj.marker_refs.indexOf(timeline_obj.dataset.datapoints[i].location) == -1){
				map_obj.marker_refs.push(timeline_obj.dataset.datapoints[i].location);
				map_obj.markers[map_obj.marker_refs.indexOf(timeline_obj.dataset.datapoints[i].location)] = 1;
				map_obj.captions[map_obj.marker_refs.indexOf(timeline_obj.dataset.datapoints[i].location)] = "<span style='font: Arial; font-size:12; font-weight:bold;'>"+timeline_obj.dataset.datapoints[i].location_title+"</span><br>"; 
				map_obj.captions[map_obj.marker_refs.indexOf(timeline_obj.dataset.datapoints[i].location)] += "<span onClick=load_datapoint("+timeline_obj.dataset.datapoints[i].id+") class='twiki_infowindow'>"+
				timeline_obj.dataset.datapoints[i].title.substring(0,35) + "... >" +
				"</span><br>";
				
				map_obj.dpt_refs[map_obj.marker_refs.indexOf(timeline_obj.dataset.datapoints[i].location)] = new Array();
				map_obj.dpt_refs[map_obj.marker_refs.indexOf(timeline_obj.dataset.datapoints[i].location)].push(timeline_obj.dataset.datapoints[i].id);
			}
			else{
				map_obj.markers[map_obj.marker_refs.indexOf(timeline_obj.dataset.datapoints[i].location)]++;
				map_obj.captions[map_obj.marker_refs.indexOf(timeline_obj.dataset.datapoints[i].location)] += "<span onClick=load_datapoint("+timeline_obj.dataset.datapoints[i].id+") class='twiki_infowindow'>"+
				timeline_obj.dataset.datapoints[i].title.substring(0,35) + "... >" +
				"</span><br>";
				
				map_obj.dpt_refs[map_obj.marker_refs.indexOf(timeline_obj.dataset.datapoints[i].location)].push(timeline_obj.dataset.datapoints[i].id);
			}			
		}
		
		//Init map		
		//Sentinel Project home
		var home_base = new google.maps.LatLng(43.65930312928092,-79.45158004760742);
		var bounds = new google.maps.LatLngBounds();
				 
		 var sentinel = [ 
			 	{              
	              featureType: 'all',
	              stylers: [{saturation: -85},{lightness:30}, {hue: '#0099CC'}]
	            }
	         ];
		 
		 var mapOptions = {
		 zoom: 14,

		 };
		 
		 map_obj.map = new google.maps.Map(document.getElementById("map_frame"),mapOptions);
		 
		 var styledMapOptions = {
		 map: map_obj.map,
		 name: "Sentinel Map"
		 }
		 
		 var sentinel_map =  new google.maps.StyledMapType(sentinel,styledMapOptions);
		 
		 map_obj.map.mapTypes.set('Sentinel Map', sentinel_map);
		 map_obj.map.setMapTypeId('Sentinel Map');				
		
		var lat_x; 
		var lat_y; 
		
		for(var i=0; i< map_obj.marker_refs.length; i++){
			lat_x = parseFloat(map_obj.marker_refs[i].substring(0, map_obj.marker_refs[i].indexOf(',')));
			lat_y = parseFloat(map_obj.marker_refs[i].substring(map_obj.marker_refs[i].indexOf(',')+1));
			
			bounds.extend(new google.maps.LatLng(lat_x, lat_y));			
			map_obj.map.fitBounds(bounds);
			
			if (map_obj.map.getZoom() > 6) 
				// zoomed too far
				map_obj.map.setZoom(6);
				
			var infowindow = new google.maps.InfoWindow({
					content: map_obj.captions[i],
					position: new google.maps.LatLng(lat_x, lat_y),
					maxWidth: 600
			});
			
			var circle;
			
			for(var j=0; j < map_obj.markers[i]; j++){
			  
			  var map_circle = {
			      strokeColor: "#0099CC",
			      strokeOpacity: 1,
			      strokeWeight: 2,
			      fillOpacity: 0,
			      map: map_obj.map,
			      center: new google.maps.LatLng(lat_x, lat_y),
			      radius: 50000*(j+1)
			  };
		      circle = new google.maps.Circle(map_circle);
		      google.maps.event.addListener(circle, 'click', show_infowindow(infowindow));			
			}
			
			//Add event listener to the datapoint listing
			for(var j=0; j < map_obj.dpt_refs[i].length; j++){
				document.getElementById("dpt_"+map_obj.dpt_refs[i][j]).onclick = dpt_events(infowindow, map_obj.dpt_refs[i][j]);
			}	
		}
				
		
		//Build the 5 months set and calculate total number of days
		var month = new Array(5);
		var year = new Array(5);
		var month_days = new Array(5);
		var totaldays = 0;
		var plot_map = new Array(timeline_obj.dataset.tags.length); 
		
		
		for (var x =0; x < year.length; x++){
			year[x] = parseInt(timeline_obj.s_year, 10);
		}
		
		for (var x = 0; x < month.length; x++){
			month[x] = parseInt(timeline_obj.s_month, 10) + x;
				
			if(month[x] > 12){
				month[x] = month[x] - 12;
				year[x] = year[x]+1;
			}
			
			month_days[x] = 32 - new Date(year[x], month[x]-1, 32).getDate();
			totaldays += month_days[x];
		}
		
		var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		
		//Day width
		var dw = 2.5;
		
		//First setup the x-axis and month timeline
		//Row height
		var rh = 30;
		
		//Sidebar width
		var sw = 150;
		
		//Timeline total width
		var ttw = 800;
		
		//Timeline total height - each tag is 30px high + 25px for lower bar
		var tth = (rh*timeline_obj.dataset.tags.length) + 25.5; 
		
		//calculate spacing between bars
		var sp = (ttw - (sw + totaldays*dw))/(totaldays);
		
		//Run through each tag, pull each datapoint
		
		//construct axis path string
		timeline_obj.paper = Raphael("timeline_frame",ttw,tth);
		var ps_x = tth - 25;
		var ps = "M0.5 " + ps_x + "L" + (ttw - 0.5) + " " + ps_x;  
		timeline_obj.paper.path(ps).attr({'stroke-width':'1', 'stroke':'#CDCDCD'});
		
		//Setup the grid for 5 months - this is what has to change for zooming in/out etc.
		//construct month vertical dividers
		var month_label_style = {
		 'fill': '#AAAAAA',
		 'font':'Arial', 
		 'font-size':10, 
		 'text-anchor':'start'
		};
		
		var cumulative_days = new Array(5);
						 
		for(var x = 0; x < month.length; x++){
			cumulative_days[x] = 0;			
			for(var y =0; y <= x; y++){
				cumulative_days[x] += month_days[y]; 
			}
			
			if(x == 0)
				ps_x = sw + 0.5;
			else
				ps_x = sw + 0.5 + cumulative_days[x-1]*dw + cumulative_days[x-1]*sp;
			
			
			ps = "M" + ps_x + " " +(tth - 25)+"L" + ps_x + " " + (tth - 1);
			timeline_obj.paper.path(ps).attr({'stroke-width':'1', 'stroke':'#CDCDCD'});	
			var month_label = m[month[x]-1] + ' ' + year[x]; 				 
			timeline_obj.paper.text(ps_x+5, tth-6, month_label.toUpperCase()).attr(month_label_style);		
		}
		// End 5 month bar setup

		// Tag row setup
		for(var x = 0; x < timeline_obj.dataset.tags.length; x++){
		
			plot_map[x] = new Array(totaldays+1);
		
			// Only draw row lines for the second tag and up
			if(x > 0){
				ps = tth - (25 + x*rh);
				ps = "M0.5 " + ps + "L" + (ttw - 0.5) + " " + ps;  
				timeline_obj.paper.path(ps).attr({'stroke-width':'1', 'stroke':'#EFEFEF'});				
			}
			
			//Write tag label
			var tag_label = timeline_obj.paper.text(3, tth-(25 + x*rh + 10), timeline_obj.dataset.tags[x].toUpperCase()).attr(month_label_style);
			
			//TODO: make the tag labels clickable to explore related content
			
			//Tag row setup: go through all datapoints associated with current tag
			for(var y = 0; y < tag_dpt_ref[x].length; y++){
				
				//It's important to specify the base10 radix in the parseInt function - otherwise, 09 gives you 0 - annoying bug
				var start_month = parseInt(timeline_obj.dataset.datapoints[tag_dpt_ref[x][y]].start_date.slice(5,7), 10);				
				var end_month = parseInt(timeline_obj.dataset.datapoints[tag_dpt_ref[x][y]].end_date.slice(5,7), 10);
												
				// Which days to use
				var start_slot = 1;
				var end_slot = totaldays;
				
				var abs_month_id = 0;
				var prev_month_days = 0;
				
				//Set the range for this datapoint
				for(var j = 0; j < month.length; j++){
					if(start_month == month[j]){
						//start is within the range
						prev_month_days = 0;
						abs_month_id = j;
						for(var i = abs_month_id; i > 0; i--){
							prev_month_days += (new Date(year[i-1], month[i-1], 0)).getDate();
						}
						start_slot = parseInt(timeline_obj.dataset.datapoints[tag_dpt_ref[x][y]].start_date.slice(8,10), 10)+prev_month_days;
					}
					
					if(end_month == month[j]){
						//end is within the range
						prev_month_days = 0;
						abs_month_id = j;
						for(var i = abs_month_id; i > 0; i--){
							prev_month_days += (new Date(year[i-1], month[i-1], 0)).getDate();
						}
						end_slot = parseInt(timeline_obj.dataset.datapoints[tag_dpt_ref[x][y]].start_date.slice(8,10), 10)+prev_month_days;
					}
										
				}
								
				for (var m = start_slot; m <= end_slot; m++){
					if(plot_map[x][m])
						plot_map[x][m] += 1;
					else
						plot_map[x][m] = 1;			
				}
			}			
			 
		}
		//End Tag row setup
		
		//Now use the plot map to plot each day - run through each tag and plot each bar			
		var plot_y = 0; var plot_x = 0; var plot_height = 0;
		
		for(var i=0; i<plot_map.length;i++){
			//set drawing baseline height
			plot_y = tth - (25.5 + i*rh);
			var color = "#0099CC";
			for(var j=0; j<plot_map[i].length; j++){
				if(plot_map[i][j] > 0){
					//Set x coord 					
					plot_x = sw + ((dw)*(j-1)+(sp)*(j-1));						
					// This probably needs to be a different function as it gets more sophisticated
					//Currently its just an asymptopic function that approaches row height as total for each day grows
					plot_height = rh*(plot_map[i][j]/((1.7*plot_map[i][j]) + 1));
					timeline_obj.paper.rect(plot_x, plot_y, dw, 0).attr({'stroke': 'none', 'fill':color}).animate({'height':plot_height, 'y':(plot_y - plot_height)},1500, '>');
				}
			}	 			
		}				
		// End Tag row setup
		
		// Forward and next buttons
		var prev = timeline_obj.paper.set(); 
		prev.push(timeline_obj.paper.circle(12, tth-12, 10).attr({'stroke': 'none', 'fill':'#EFEFEF', 'opacity':'45', 'cursor':'pointer'}));
		prev.push(timeline_obj.paper.text(8, tth-12, "<").attr(month_label_style).attr({'font-size':14, 'fill':'#CCCCCC', 'cursor':'pointer'}));
		
		timeline_obj.prev_month = timeline_obj.s_month - 1;
		timeline_obj.prev_year = timeline_obj.s_year;
		
		if(timeline_obj.prev_month == 0){
			timeline_obj.prev_month = 12;
			timeline_obj.prev_year = timeline_obj.prev_year - 1; 
		} 
		
		prev.click(
			function(){
				document.getElementById("top").innerHTML = "<img src='http://www.thesentinelproject.org/threatwiki/l.gif' /><strong> Generating... </strong>";
				
				if(timeline_obj.context == 'default')
					grid_load_data(timeline_obj.prev_month, timeline_obj.prev_year);
				else	
					grid_load_data(timeline_obj.prev_month, timeline_obj.prev_year, timeline_obj.context);
			}
		);
		
		var next = timeline_obj.paper.set();
		next.push(timeline_obj.paper.circle(sw-12, tth-12, 10).attr({'stroke': 'none', 'fill':'#EFEFEF', 'opacity':'45', 'cursor':'pointer'}));
		next.push(timeline_obj.paper.text(sw - 16, tth-12, ">").attr(month_label_style).attr({'font-size':14, 'fill':'#CCCCCC', 'cursor':'pointer'}));
		
		timeline_obj.next_month = timeline_obj.s_month + 1;
		timeline_obj.next_year = timeline_obj.s_year;
		
		if(timeline_obj.next_month == 13){
			timeline_obj.next_month = 1;
			timeline_obj.next_year = timeline_obj.next_year + 1; 
		}
		
		next.click(
			function(){
				document.getElementById("top").innerHTML = "<img src='http://www.thesentinelproject.org/threatwiki/l.gif' /><strong> Generating... </strong>";
				
				if(timeline_obj.context == 'default')
					grid_load_data(timeline_obj.next_month, timeline_obj.next_year);
				else
					grid_load_data(timeline_obj.next_month, timeline_obj.next_year, timeline_obj.context);
			}
		); 
		// End Forward and next buttons	
	}
	
	
	
	
	function load_datapoint(id){
	
			now = new Date();
			now.setMonth(now.getMonth() - 4);
			
			document.getElementById("single_datapoint_display").innerHTML = "<br><img src='http://www.thesentinelproject.org/threatwiki/l.gif' /> Loading... ";
			
			document.getElementById("single_datapoint_display").style.borderBottom ='1px #999 solid';
			
			var output = '';
			var c = new XMLHttpRequest();	
			c.open('GET', 'http://threatwiki.thesentinelproject.org/req_dpt/?id='+id, true);
			c.onreadystatechange = function(){
				if (c.readyState == 4) {
					var output = eval("("+c.responseText+")");
					//Populate content frame
					
					document.getElementById('single_datapoint_display').innerHTML = "<div class='twiki_single_dpt_title'>"+output.title+"</div>";
					document.getElementById('single_datapoint_display').innerHTML += "<div>"+output.description+"</div>";
					document.getElementById('single_datapoint_display').innerHTML += "<br><br>";
					if(output.start_date == output.end_date)
						document.getElementById('single_datapoint_display').innerHTML += "<strong>Date:</strong> "+ output.start_date;
					else
						document.getElementById('single_datapoint_display').innerHTML += "<strong>Date:</strong> "+ output.start_date + " to " + output.end_date;
						
					document.getElementById('single_datapoint_display').innerHTML += "<br>";
					
					if(output.links.length > 0){
						document.getElementById('single_datapoint_display').innerHTML += "<strong>Links:</strong><br> ";
						for(var i = 0; i < output.links.length; i++){
							document.getElementById('single_datapoint_display').innerHTML += "<a href='"+output.links[i]+"'>" + output.links[i] + "</a><br>";
						}
						
					}
					document.getElementById('single_datapoint_display').innerHTML += "<strong>Explore related events by tag:</strong> ";				
					
					for(var i = 0; i < output.tags.length; i++){
						document.getElementById('single_datapoint_display').innerHTML += "<span style='color:#0099CC; cursor:pointer;' onclick=grid_load_data("+timeline_obj.s_month+","+ timeline_obj.s_year+"," + output.tags[i].id + ")>"+"[ "+ output.tags[i].title + " ] " + "</span>";
					}
											
					}
			};
			c.send(null);
			
	}

//**********************************************************************************//
// Eye/Correlation Tab
//**********************************************************************************//
		
	var correl_obj = new Object;
	
	function correl_build_frame(){
		document.getElementById("top").innerHTML = "<img src='http://www.thesentinelproject.org/threatwiki/l.gif' /><strong> Generating... </strong>";
		
		var content_string = "<div id='eye_frame' style='float:left; width:600px; height:600px;'></div><div id='eye_sidebar' style='float:right; width:175px; height:580px; margin-left:5px; background-color:#222; padding:10px; color:#FFF;'></div><div style='clear:both;'></div><div style='margin-top:5px; border-top:3px solid #CCC'> </div>";
		
		document.getElementById("canvas_holder").innerHTML = content_string;
		
		content_string = "<div style='font-size:20px; font-weight:bold;'>Eye on Genocide</div> <br>";
		
		content_string += "The Sentinel Project tracks genocide risk by identifying key organizations and individuals, operational processes and other trends. These are represented as tags.<br><br> This is a visualization of all the tags identified within this system. The number of connections between pairs of tags represents the strength of the correlation between them in the underlying data that we have collected. <br><br> Click on any tag to browse a timeline of relevant events.<br><br> We are developing additional visualizations - more to come soon!";
		
		document.getElementById("eye_sidebar").innerHTML = content_string;
				
		correl_obj.frame_width = 800;
		correl_obj.frame_height = 600;
		correl_obj.paper = Raphael("eye_frame",correl_obj.frame_width,correl_obj.frame_height);	
		
		correl_obj.paper.rect(0.5,0.5,600-1,600-1).attr({ fill:"none", stroke:"#CCC", 'stroke-width':"1" });
		correl_obj.paper.circle(600/2, 600/2, 190).attr({'stroke-width':'1', 'stroke':'#EFEFEF'}); 
		
		correl_load_data();
	}
			
	function correl_load_data(){
		var c = new XMLHttpRequest();		
		c.open('GET', 'http://threatwiki.thesentinelproject.org/correlate/?soc='+master_soc_id, true);
		c.onreadystatechange = function(){
			if (c.readyState == 4) {
				var data = eval("{data:"+c.responseText+"}");
				correl_plot(data);			
			}
		};
	c.send(null);
	
	}
	
	function correl_plot(data){
	
		// canvas variables
		var canvas = 190;
		var dot_size = 4;
		var x_origin = 300;		
		var y_origin = 50;						
		var x = x_origin;
		var y = y_origin;
		
		// local arrays
		var tag_points = [];
		var tag_sizes = [];
		
		// What is this?
		correl_obj.paper.customAttributes.tag_id = function (id) {return id};
		correl_obj.paper.customAttributes.text_obj = function (text_obj) {return text_obj};
		
		for(var i = 0; i < data[0].tags.length;i++) {
			id = data[0].tags[i].id;
			
			tag_points[id] = [x_origin+x, y];
			tag_sizes[id] = dot_size;
			
			// Draw Circle point
			x = x+5;
			//correl_obj.paper.circle(x, y, dot_size).attr({'stroke-width':'0', 'fill':'#0099CC'});
			
		}

		
		//Run through all tags and plot on circle
		var r = 190;
		var x = 0 - r;
		var y = 0;
		var dot_size = 4;
		var o_x = 600/2;
		var o_y = 600/2;		
		
		var tag_points = [];
		var tag_sizes = [];
		
		var step = Math.floor((2*r/(data[0].tags.length-1)));
		var toggle = 1;
		
		correl_obj.paper.customAttributes.tag_id = function (id) {return id};
		correl_obj.paper.customAttributes.text_obj = function (text_obj) {return text_obj};
						
		for(var i=0;i<data[0].tags.length;i++){
		
			y = o_y - Math.sqrt(r*r - x*x);
			
			if(toggle == -1) 
				y = 2*(o_y - y) + y;
			
			//dot_size = (Math.floor(Math.random() * (8 - 4 + 1)) + 4);
			dot_size = 3;
			tag_points[data[0].tags[i].id] = [o_x+x,y];
			tag_sizes[data[0].tags[i].id] = dot_size;
			
			//now draw labels	
			var xl = 0; var yl = 0; var xr = x; var yr = o_y-y; var xp = 0; var yp = 0; var m = 0; var delta = 0.1;
			var path = ''; var label = ''; var length = 50;
			
			m = yr/xr;
			
			//To generate constant length label lines, scale the x step 
			xl = length/Math.sqrt(1+m*m);
			
			if (xr < 0)
				xl = xr - xl;
			else
				xl = xr + xl;
			
			yl = m*xl;
			
			xp = o_x + xl;
			yp = o_y - yl;
					
			path = "M"+(o_x+x)+","+y+"L"+(xp)+","+yp;
			label = data[0].tags[i].title;
			
			correl_obj.paper.path(path).attr({"fill": "none", "stroke-width": 1, stroke:"#EFEFEF"});
			correl_obj.paper.circle((o_x+x), y, dot_size).attr({'stroke-width':'0', 'fill':'#0099CC'});
			
			var label_text = correl_obj.paper.text((o_x+xl-25), yp, label).attr({'fill':'#FFF', 'text-anchor':'start'});
			
			var label_bar = correl_obj.paper.rect((o_x+xl-28),yp-8,0,17, 3).attr({ fill:"#0099CC", 'stroke-width':"0", opacity:1, tag_id:data[0].tags[i].id, text_obj:label_text});
			
			label_text.toFront();
			
			label_bar.attr({'width':label_text.node.getComputedTextLength()+5});
			label_text.attr({text_obj:label_bar});
			
			// Set up clickability			
			label_bar.hover(function(event){
				this.toFront();
				this.attr('text_obj').toFront();
				this.attr({'cursor':'pointer'});
				this.attr('text_obj').attr({'cursor':'pointer'});
			});
			
			
			label_bar.mouseout(function(event){
			});
			
			
			label_text.click(function(){
				delete correl_obj.paper;
				
				document.getElementById("canvas_holder").innerHTML = '';
				document.getElementById("toaster").innerHTML = '';
				
				tab_switch('timeline');
				
				now = new Date();
				now.setMonth(now.getMonth() - 4);				
				grid_load_data((now.getMonth() + 1), now.getFullYear(), this.attr('text_obj').attr('tag_id'));
				
			});
			
			label_text.hover(function(event){

			});
			
			label_bar.mouseout(function(event){
			
			});
						
			x = x+step;
			toggle = toggle*(-1);
		}
		
		for(var i=0;i<data[1].pairs.length;i++){
			
			var p1 = data[1].pairs[i].id[0];
			var p2 = data[1].pairs[i].id[1];
			var x1 = 0; var x2 = 0; var y1 = 0; var y2 = 0; x3=0; y3 = 0;
			var path = '';
			
			x1 = tag_points[p1][0];
			y1 = tag_points[p1][1];
			
			x2 = tag_points[p2][0];
			y2 = tag_points[p2][1];					
			 										
			for(var j=0; j< data[1].pairs[i].count;j++){
			
				if(Math.floor(Math.random()*2) == 1)
					x3 = x2 - (Math.floor(Math.random() * (50 - 30 + 1)) + 30);
					else
						x3 = x2 + (Math.floor(Math.random() * (50 - 30 + 1)) + 30);
				
				if(Math.floor(Math.random()*2) == 1)
					y3 = y2 - (Math.floor(Math.random() * (50 - 30 + 1)) + 30);
					else
						y3 = y2 + (Math.floor(Math.random() * (50 - 30 + 1)) + 30);
			
				path = "M"+x1+","+y1+"S"+x3+","+y3+","+x2+","+y2;
				correl_obj.paper.path(path).attr({"fill": "none", "stroke-width": 1, stroke:"#0099CC"});
				
				//increase the dot size of each tag in pair
				tag_sizes[data[1].pairs[i].id[0]] += 1.5;
				tag_sizes[data[1].pairs[i].id[1]] += 1.5;		
			}
							
		}
		
		for(var i=0;i<data[0].tags.length;i++){
			correl_obj.paper.circle(tag_points[data[0].tags[i].id][0],tag_points[data[0].tags[i].id][1], tag_sizes[data[0].tags[i].id]).attr({'stroke-width':'0', 'fill':'#0099CC'});	
		}
		
		document.getElementById('top').innerHTML = '';
	}
			


	

//**********************************************************************************//
// Utilities
//**********************************************************************************//	
	

	//Clear the screen inbetween vizualizations
	function init_switch(viz){
	
		if (timeline_obj.paper) delete timeline_obj.paper;
		if (correl_obj.paper) delete correl_obj.paper;
		
		document.getElementById("canvas_holder").innerHTML = '';
		document.getElementById("toaster").innerHTML = '';
	
		if (viz == 'timeline'){			
			now = new Date();
			now.setMonth(now.getMonth() - 4);
			grid_load_data((now.getMonth() + 1), now.getFullYear());
		}
		
		if (viz == 'eye'){
			correl_build_frame();
			//document.getElementById("toaster").innerHTML = eye_toaster_content;
		}
		
		if (viz == 'background'){
			document.getElementById("top").innerHTML ='';
			document.getElementById("toaster").innerHTML = background_toaster_content;
		}
		
		tab_switch(viz);
	}
	
	function show_infowindow(infowindow){
		return function(){
			//Get rid of existing infowindow 
			if(map_obj.curr_caption){
				map_obj.curr_caption.close();
			}
			infowindow.open(map_obj.map);
			map_obj.curr_caption = infowindow; 
		};
	}
	
	function dpt_events(infowindow, id){
		return function(){
			load_datapoint(id);
			show_infowindow(infowindow)();
		}		
	}
	
	function tab_switch(name){
			document.getElementById("timeline").style.backgroundColor = "#222";
			document.getElementById("eye").style.backgroundColor = "#222";
			document.getElementById("background").style.backgroundColor = "#222";
			document.getElementById(name).style.backgroundColor = "#0099CC";
	}
	
	
	function flipper(){
	//Just a utility to return 1 or -1 randomly
		if(Math.floor(Math.random()*2) == 1)
			return 1;
		else
			return -1;
	}
	
	//Credit to: http://www.netlobo.com/url_query_string_javascript.html
	// Grabs arguments in URL string
	function gup( name ){
		  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		  var regexS = "[\\?&]"+name+"=([^&#]*)";
		  var regex = new RegExp( regexS );
		  var results = regex.exec( window.location.href );
		  if( results == null )
		    return "";
		  else
		    return results[1];
	}			 