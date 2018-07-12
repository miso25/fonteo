# Fonteo
Fonteo is a jQuery based plugin for animating selected text on your website

# Requirements:
Fonteo plugin requires the latest version of [jQuery](http://jquery.com/).

# Usage
Add Fonteo Plugin to your page 

	<script type='text/javascript' src='fonteo.min.js' ></script>

Then insert an element with some text to your HTML output 

	<p class='text'>Hello World! I am Fonteo - a jQuery Plugin to animate text...</p>
 
This is a basic usage without text movement. It only splits a text within all elements with the class ".text" to individual letters and adds some animation. Check [jsFiddle example](https://jsfiddle.net/miso25/5u1q7s1n/4/)

	$('.text').fonteo()

Adding some animation to the text with basic typing effect. If a value of the property 'infinite' is set to 'true', text starts moving to the left after the letters are initialized. Check [jsFiddle example](https://jsfiddle.net/miso25/xup0tvua/10/)

	$('.text').fonteo({ direction: 'left' })
	
Adding custom animation to the text. Check [jsFiddle example](https://jsfiddle.net/miso25/fgg9c0r9/6/)

Simple loading animation. Check [jsFiddle example](https://jsfiddle.net/miso25/956d0nkp/5/)

	var opts = {
		direction: 'left', 
		infinite: true,
		speed: 200,
		letterIn: function(lr){
			lr.animate({'font-size':'30px', 'margin-left':'5px'})
		}
	}
	
	$('.text').fonteo( opts )
	
Use events 'letterIn' and 'letterOut' for adding custom animation to your text. See the [jsFiddle example](https://jsfiddle.net/miso25/3kk9m9qx/5/)

# Options
A complete listing of all options applicable for this plugin.

Option | Data Attribute | Data type | Default | Description
----|------|----|----|----
moving | data-moving  | boolean | false  | Moving text to the left or right
direction | data-direction | string:{'left','right'} | 'left'  | Set direction of text movement. Only applicable if value of property moving is set to true. 
infinite | data-infinite  | boolean | false  | infinite
speed | data-speed | float | 100  | speed in fps (frames per seconds)
text | data-text  | string | ''  | text
pauseOnHover | data-pause-on-hover | boolean | false  | pauseOnHover
className | data-class-name | string | 'fonteo-letter'  | className
tpl | data-tpl  | string | '<span>{{fonteo-letter}}</span>'  | tpl

# Public API
Toggle pause of text movement. Check [jsFiddle example](https://jsfiddle.net/miso25/aavdvq3k/6/)

# Browser compatibility

# Documentation

# Copyright and license
The license is available within the repository in the [LICENSE](https://github.com/miso25/fonteo/blob/master/LICENSE.md) file.
