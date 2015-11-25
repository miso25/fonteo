# Fonteo
Fonteo is a jQuery based plugin for animating selected text on your website


# Usage

Add Fonteo Plugin to your page 

	<script type='text/javascript' src='fonteo.min.js' ></script>

Then insert a text to your HTML output 

	<p class='text'>Hello World! I am Fonteo - a jQuery Plugin to animate text...</p>
 
This is a basic usage. It only splits a text within all elements with the class ".text" to individual letters.

	$('.text').fonteo()

Adding some animation to the text with basic typing effect. If a value of the property 'infinite' is set to 'true', text starts moving to the left after the letters are initialized. Check [jsFiddle example](https://jsfiddle.net/miso25/xup0tvua/)

	$('.text').fonteo({ direction: 'left' })
	
Adding custom animation to the text. Check [jsFiddle example](https://jsfiddle.net/miso25/fgg9c0r9/)

	var opts = {
		direction: 'left', 
		infinite: true,
		speed: 200,
		letterIn: function(lr){
			lr.animate({'font-size':'30px', 'margin-left':'5px'})
		}
	}
	
	$('.text').fonteo( opts )
	
Use events 'letterIn' and 'letterOut' for adding custom animation to your text. See the [jsFiddle example](https://jsfiddle.net/miso25/3kk9m9qx/)

# Public API
Toggle pause of text movement. Check [jsFiddle example](https://jsfiddle.net/miso25/aavdvq3k/)

# Browser compatibility

# Documentation

# Copyright and license
The license is available within the repository in the [LICENSE](https://github.com/miso25/fonteo/blob/master/LICENSE.md) file.
