<?php

/*
Template Name: ThreatWiki / SOC Template
*/

	// calling the header.php
    get_header();

    // action hook for placing content above #container
    thematic_abovecontainer();

?>
	<script type="text/javascript" src="http://www.thesentinelproject.org/threatwiki/raphael.js"></script>
	<script type="text/javascript" src="http://www.thesentinelproject.org/threatwiki/threatwiki.js"></script>		
	<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>	
	<link rel='stylesheet' href='http://www.thesentinelproject.org/threatwiki/threatwiki.css' type='text/css' /> 

	<div id="threatwiki_frame" class="threatwiki_frame">
		
		<?php
			// calling the widget area 'page-top'
	        get_sidebar('page-top');
				thematic_abovepost();
	        
	        //thematic_postheader();
	        the_content();
	    	thematic_belowpost();
	    	get_sidebar('page-bottom');
		?>
		<div id='soc_header_frame' style="background-color:#222; padding:15px; color:#FFF; margin-bottom:10px; margin-top:-13px; border-radius: 5px;">
			
			<div id="soc_title" style="font-size:30px; font-weight:bold; margin-bottom:18px;">
			 	<script>
			 		 document.getElementById('soc_title').innerHTML = document.getElementById('soc_title_content').innerHTML; 
			 	</script>			 
			 </div>
			 
			 <div id="soc_header">
			 	<script>
			 		 document.getElementById('soc_header').innerHTML = document.getElementById('soc_header_content').innerHTML; 
			 	</script>
			 </div>
			 <br>
			 <div id="blog_update">
			 	<script>
			 		 document.getElementById('blog_update').innerHTML = document.getElementById('blog_update_content').innerHTML; 
			 	</script>
			 </div>
			
		</div>	    
	    
	    <div id="viz_switch">
	    
	    	<div id="timeline_button" style="cursor:pointer; float:left; width:180px;" onclick="init_switch('timeline')">
	    		<div id="timeline" style="border-top-radius:10px; width:167px; height:50px; background-color:#222; color:#FFF; padding:5px; padding-bottom:8px;">
	    			<img src="http://www.thesentinelproject.org/threatwiki/timeline_icon.png"/><br>
	    			Timeline
	    		</div>
	    	</div>
	    	
			<div id="eye_button" style="cursor:pointer; float:left; width:180px;" onclick="init_switch('eye')">
	    		<div id="eye" style="border-top-radius:10px; width:167px; height:50px; background-color:#222; color:#FFF; padding:5px; padding-bottom:8px;">
	    			<img src="http://www.thesentinelproject.org/threatwiki/eye_icon.png"/><br>
	    			Correlations
	    		</div>
	    	</div>
			
			<div id="background_button" style="cursor:pointer; float:left; width:180px;" onclick="init_switch('background')">
				<div id="background" style="width:167px; height:50px; background-color:#222; color:#FFF; padding:5px; padding-bottom:8px;">
					<img src="http://www.thesentinelproject.org/threatwiki/background_icon.png"/><br>
					Background
				</div>
			</div>
			
			<div style="clear:both;"></div>
			
		</div>

		<div style="clear:both; height:3px; background-color:#999; margin-top:3px"></div>
	    
	    <div id="top" style="margin-top:5px; clear:both;">		
		</div>
		
		<div id="canvas_holder">			
		</div>
		
		<div id="toaster" style="margin-top:10px;">
		</div>
		
	</div>
	
	<div id="container">		
			<div id="content">
			    <!-- SOC Banner and caption text -->
			    <!--
			    <div id="top_soc_banner" style="clear:both; width:100%; position:relative; margin-bottom: 3px;">
			    
				</div>
				-->
			</div>
		<?php thematic_belowcontent(); ?>
	</div>	
						
	<script>
	
		function getInternetExplorerVersion()
		// Returns the version of Internet Explorer or a -1
		// (indicating the use of another browser).
		{
		  var rv = -1; // Return value assumes failure.
		  if (navigator.appName == 'Microsoft Internet Explorer')
		  {
		    var ua = navigator.userAgent;
		    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		    if (re.exec(ua) != null)
		      rv = parseFloat( RegExp.$1 );
		  }
		  return rv;
		}
		
		var p = 0;
		var now = '';
		var img = new Image();
		img.src = "http://www.thesentinelproject.org/threatwiki/l.gif";
		var eye_toaster_content = document.getElementById("eye_toaster_content").innerHTML;
		var background_toaster_content = document.getElementById("background_toaster_content").innerHTML;
		document.getElementById("eye_toaster_content").innerHTML = '';
		document.getElementById("background_toaster_content").innerHTML = '';
		
		if(tab == undefined)
			var tab = gup('tab');
		
		if (getInternetExplorerVersion() > -1 && getInternetExplorerVersion() < 9){
			tab = '3';
			
			document.getElementById('soc_header_frame').innerHTML = "<div id='IE_error_text' style='padding:8px; background-color: #FFDE40; color:#000; font-size:11px; border:1px dotted #222'></div> <br>" + document.getElementById('soc_header_frame').innerHTML;
			
			document.getElementById('IE_error_text').innerHTML = 'You are using Internet Explorer ' + getInternetExplorerVersion() +'. Unfortunately, our situation visualization software currently supports Internet Explorer 9 and higher, in addition to Mozilla Firefox and Google Chrome. Thus, you will only be able to partially access our data. Our interactive timeline and correlations sections will be unavailable. We sincerely apologize for the inconvenience.';
						
		}
		
		//We eventually need to have permanent links to the content on the background tab.
		if(tab == '2'){
			init_switch('eye');
		}
		
		else if (tab == '3'){
			init_switch('background');
			if (getInternetExplorerVersion() > -1 && getInternetExplorerVersion() < 9){
				document.getElementById('timeline').style.backgroundColor = '#CCC';
				document.getElementById('eye').style.backgroundColor = '#CCC';
				
				document.getElementById('timeline_button').onclick = 'alert(3)';
				document.getElementById('eye_button').onclick = 'alert(3)';
							
				document.getElementById('timeline_button').style.cursor = '';
				document.getElementById('eye_button').style.cursor = '';
			}
		}
		
		else 
			init_switch('timeline');
	</script>

<?php 

    // action hook for placing content below #container
    thematic_belowcontainer();

    // calling the standard sidebar 
    //thematic_sidebar();
    
    // calling footer.php
    get_footer();

?>