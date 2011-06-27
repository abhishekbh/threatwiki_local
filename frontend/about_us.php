<?php
/*
Template Name: About Us page
*/
    // calling the header.php
    get_header();
    // action hook for placing content above #container
    thematic_abovecontainer();
?>
<div style="height:7px;"> </div>
		<div id="container">
			<?php thematic_abovecontent(); ?>
			<div id="content">
	            <?php
	            	// calling the widget area 'page-top'
	            	get_sidebar('page-top');
	            	the_post();
	            	thematic_abovepost();
	            ?>
	            
				<div id="post-<?php the_ID();
					echo '" ';
					if (!(THEMATIC_COMPATIBLE_POST_CLASS)) {
						post_class();
						echo '>';
					} else {
						echo 'class="';
						thematic_post_class();
						echo '">';
					}
	                // creating the post header
	                //thematic_postheader();
	                ?>
	                
					<div class="entry-content">
					

					
					
					
	                    <?php
	                    //the_content();
	                    ?>
	                    	<p>Formed in 2008, The Sentinel Project for Genocide Prevention is a non-profit organization based in Canada with members in several countries worldwide.</p>
	                    	<p style="text-align: justify; padding-left: 30px;">
	                    		<strong>Our mission is to prevent the crime of genocide worldwide through effective early warning and cooperation with victimized peoples to carry out non-violent prevention initiatives.</strong>
	                    	</p>
	                    	<p> Interested in supporting the Project? <a href="http://thesentinelproject.org/?page_id=823">Get involved!</a><p> 
	                    	<div id="member_list">
	                    		<a name="team"></a><div class="t_page_header_1">THE TEAM</div>
	                    		<hr>
	                    		<div style="height:1px; margin-top:-10px"> </div>
	                    	</div>
	                    	<div style="clear:both; height:8px;"> </div>
	                    	<hr>
	                    	
	                    	<a name="governance"></a><div class="t_page_header_1">GOVERNANCE STRUCTURE</div>
	                    	<p>As a non-profit organization, the Sentinel Project has a governance structure in place to ensure transparency and accountability. This page explains the responsibilities of our co-executive directors, board of directors, and advisory board as well as our by-laws.</p>
	                    	<div class="t_page_header_2"><a href="http://thesentinelproject.org/?page_id=902">READ MORE ></a></div><hr>
	                    	
	                    	<a name="contact"></a><div class="t_page_header_1">CONTACT US</div>
	                    	<p>
	                    	The Sentinel Project for Genocide Prevention<br> 
							2705-2360 Dundas Street West<br> 
							Toronto, Ontario M6P 4B2 Canada<br> 
							Phone:+1 647 222 8821 <br>
							Phone: +1 519 760 4496 <br>
							Email: contact@thesentinelproject.org
							</p>
							<hr>
							
							
						<script>
						var c = new XMLHttpRequest();	
						c.open('GET', 'http://thesentinelproject.org/member_avatars/a.txt', true);
						c.onreadystatechange = function(){
							if (c.readyState == 4) {
								var list = eval("("+c.responseText+")");
								
								var output = ""; 
								var flip = 1;
								var image;
								
								for(var i=0; i<list.members.length; i++){
									if(list.members[i].fn == 'none') image = 'avatar.jpg';
									else image = list.members[i].fn;
									
									output += '<div style="float:left; width:80px;"><img style="margin:0 0 0 0;" src="http://thesentinelproject.org/member_avatars/'+image+'"></div>';
									output += '<div style="float:left;">';	
	                    			output += '<div style="height:60px; width:165px; padding:10px; line-height:19px; text-align:left; font-size:13px; color: #FFF; background-color:#000; word-wrap:break-word">';
	                    			output += list.members[i].name;
			                    	output += '<br><span style="font-size:11px; line-height:14px; color:#CCC">';
			                    	output += list.members[i].pos +'<br>';
			                    	output += list.members[i].email+'</span></div></div>';
			                    	
			                    	if(flip == 1) output += '<div style="float:left; margin-left:10px;"><br></div>';
			                    	else output += '<div style="clear:both; height:10px;"> </div>';
			                    	
			                    	flip = flip*-1;
	
								}
								
								document.getElementById('member_list').innerHTML += output;
					
							} 
						};
						c.send(null);
						</script>
							
	
	                    <?
	                    wp_link_pages("\t\t\t\t\t<div class='page-link'>".__('Pages: ', 'thematic'), "</div>\n", 'number');
	                    edit_post_link(__('Edit', 'thematic'),'<span class="edit-link">','</span>') ?>
					</div><!-- .entry-content -->
				</div><!-- #post -->
	
	        <?php
	        
	        thematic_belowpost();
	        
	        // calling the comments template
       		/*if (THEMATIC_COMPATIBLE_COMMENT_HANDLING) {
				if ( get_post_custom_values('comments') ) {
					// Add a key/value of "comments" to enable comments on pages!
					thematic_comments_template();
				}
			} else {
				thematic_comments_template();
			}*/
	        
	        // calling the widget area 'page-bottom'
	        get_sidebar('page-bottom');
	        ?>
	
			</div><!-- #content -->			
			<?php thematic_belowcontent(); ?> 
		</div><!-- #container -->
<?php 
    // action hook for placing content below #container
    thematic_belowcontainer();
    // calling the standard sidebar 
    thematic_sidebar();
?>    
    
<?    
    // calling footer.php
    get_footer();
?>