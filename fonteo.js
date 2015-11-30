/*
 *  Project: Fonteo 1.0
 *  Description: Fonteo is a jQuery Plugin that animates selected text on your website
 *  Author: miso25
 *  License: MIT
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.

;(function ( $, window, document, undefined ) {

	
	window.cancelRequestAnimFrame = ( function() {
			return window.cancelAnimationFrame          ||
				window.webkitCancelRequestAnimationFrame    ||
				window.mozCancelRequestAnimationFrame       ||
				window.oCancelRequestAnimationFrame     ||
				window.msCancelRequestAnimationFrame        ||
				clearTimeout
		} )();

	
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
				function(/* function */ callback, /* DOMElement */ element){
					return window.setTimeout(callback, 1000 / 60);
				};
		})();
		
    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window is passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'fonteo',
        defaults = {
            plugin: "fonteo"
        };

    // The actual plugin constructor
    function fonteoPlugin( element, options ) {
        //this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        
		this.elem = element;
		this.$elem = $(element);
		this.options = options;
		
		this.letters = {};
		this.timer = {};
		this.incLetter = 0;
		this.repeating = false;
		// This next line takes advantage of HTML5 data attributes
		// to support customization of the plugin on a per-element
		// basis. For example,
		// <div class=item' data-plugin-options='{"message":"Goodbye World!"}'></div>
		//this.metadata = this.$elem.data( 'plugin-options' );
		this.metadata = this.$elem.data( );
		
		this._init();
		
    }

	
	//Plugin.prototype = 
	fonteoPlugin.prototype = 
	{
	
		defaults: { 
			direction: 'default',
			infinite: false,
			moving: false,
			text: '',
			speed: 100,
			pauseOnHover: false,
			className: 'fonteo-letter',
			tpl: "<span>{{fonteo-letter}}</span>",
						
			letterIn: false,
			letterOut: false,
			complete: false,
			mouseenter: false,
			mouseleave: false,	
		},
		
		
		lang: {
			
		},
		
		_init: function() {
			// Introduce defaults that can be extended either 
			// globally or using an object literal. 
			this.config = $.extend({}, this.defaults, this.options, this.metadata);
			//console.log( JSON.stringify( 1 ) )


			var self = this
			
			self.id = self._getRandomInt(999,99999)
			
			var text = self.$elem.text()
			if(text)
			self.config.text = text
			
			self.letters = self.config.text.split("");
			self.wasPaused = false
			self.wasToggled = false
			self.speed = self.config.speed
			self.request = 0
			
			self.reps = 0
			self.length = self.letters.length
			
			//self._animate()
			self.$elem.text("")
			self.moving = self.config.moving
			//self.moving = self.config.direction === 'left' || self.config.direction === 'right'
			if(!self.moving)
			self._createTextDefault();
			
			self._loop()
			//else
			//self._createTextDefault();
			
			
			
			
			self.$elem.on('mouseenter','.'+self.config.className, function(){
					if( self.config.mouseenter && typeof self.config.mouseenter == 'function' )
					self.config.mouseenter( $(this) )
					if(self.config.pauseOnHover)
					self.pause()
			})

			
			
			self.$elem.on('mouseleave','.'+self.config.className, function(){
					if( self.config.mouseleave && typeof self.config.mouseleave == 'function' )
					self.config.mouseleave( $(this) )
					if(self.config.pauseOnHover)
					self.unpause()
				})
			self.$elem.on('click','.'+self.config.className, function(){
					//if( self.config.mouseleave && typeof self.config.mouseleave == 'function' )
					//self.config.mouseleave( $(this) )
					//if(self.config.pauseOnHover)
					
					self.toggleDirection()
				})
			
		},
			
		_animate: function ( clear )
		{
			var self = this
			
			if(clear !== false)
			self.$elem.text("")
			
			if(self.config.direction == 'left')
				self._leftText();
			else if(self.config.direction == 'right')
				self._rightText();
			else
				self._createTextDefault();
		},
		
		_createTextDefault: function (  )
		{
			var self = this
			self.$elem.text("")
			//var Otext=cont1.text();
			//var c = self.config.text.split("");

			for(var i=0; i< self.letters.length; i++)
			{	
				var jletter = self._createLetter( self.letters[i] )

				self.$elem.append( jletter );
			}
					
		},
		
		
		
		
		_getEdgeLetter: function ( eq, p )
		{
			var self = this
			
			
			var ltrOut = self.$elem.find('.'+self.config.className+'').eq( eq )
			//var ltrOut = self.$elem.find('.'+self.config.className+':last')
		
			if(ltrOut.is(':animated'))
			{
				eq += 1 * p
				ltrOut = self._getEdgeLetter( eq, p )
			}
			//console.log( eq );
			
			return ltrOut 
		},
		
		
		
		_loop: function ( start, end )
		{
			var self = this
			
			
			
			var fps,fpsInterval,startTime,now,then,delta;
			fps = self.speed	// highest number = highest speed
			
			
			fpsInterval = 1000 / fps;
			//fpsInterval=1;
			then=Date.now();
			startTime=then;
				
			self.frames = 0


			//self.request = 0
			
			// to store the request
			//var request;

			// start and run the animloop
			


			function animloop(){
			  //render();
			  
				self.request = requestAnimFrame( animloop );
			 
				
			  
				self.frames ++ 
			  
			  
				now = Date.now();
				delta = now - then;

				
				
				
				// if enough time has elapsed, draw the next frame
				if (delta > fpsInterval) {
				//if (elapsed > fpsInterval) {
				//console.log(delta + " - " + self.speed )
				//if(fpsInterval > 50)
				//fpsInterval = fpsInterval + steps
					
					// Get ready for next frame by setting then=now, but also adjust for your
					// specified fpsInterval not being a multiple of RAF's interval (16.7ms)
					then = now - (delta % fpsInterval);

					
					self._rep()
					

					//if(!self.paused)
					//self._rep()
				}

				
					// Put your drawing code here
					//console.log( Date.now() )
				

				
				
			}
			//})();
			animloop()
			
			//})();

			// cancelRequestAnimFrame to stop the loop in 1 second
			//setTimeout(function(){
				//cancelRequestAnimFrame(request);                
			//}, 10000)

			
				
		},
		
		
		
		
		_rep: function (  )
		{
			var self = this
			
			
				if( self.reps < self.length )
					{
						
						// letter out
						if( self.moving )
						{
							if( self.repeating  )
							{
								//if(i > 10)
								//console.log( $('.fonteo-letter:last').text() )
								//self.$elem.find('.'+self.config.className+':first').remove()
								//var ltrOut = self._getEdgeLetter(0, 1) // append
								
								if(self.config.direction == 'right')			// right
								{
								
									var ltrOut = self._getEdgeLetter(-1, -1) // prepend
								}
								else
									var ltrOut = self._getEdgeLetter(0, 1) // prepend
				
								if( self.config.letterOut && typeof self.config.letterOut === 'function' )
								{
									//if(ltrOut.is(':animated'))
									//console.log('aaaaaanimated');

									
									self.config.letterOut( ltrOut )
								}
								else
								{
									ltrOut.remove()
								}
							}
						
							if(self.config.direction == 'right')			// right
							{
								//self.reps = self.length
								var jletter = self._createLetter( self.letters[ self.length - self.reps -1 ] )
								
								self.$elem.prepend( jletter );
							}
							else if(self.config.direction == 'left')			// left
							{
								var jletter = self._createLetter( self.letters[ self.reps ] )
								
								self.$elem.append( jletter );
							}
						}
						else
						{
							//var jletter = self._createLetter( self.letters[ self.reps ] )
							//console.log( self.letters[ self.reps ] )
							//console.log( self.reps )
							if(self.config.direction == 'right')
							var ltr = self.$elem.find( '.' + self.config.className ).eq( self.reps - 1 )
							else
							var ltr = self.$elem.find( '.' + self.config.className ).eq( self.length - self.reps -1 )
							
							if(  typeof self.config.animate === 'function' )
							{
								self.config.animate( ltr )
								
							}
							else
							cancelRequestAnimFrame(self.request);
							
		
							//setTimeout( function(){
							//$( '.' + self.config.className )
							//.eq( self.reps - 1 ).text(1)
							//}, 1500)
						}
						
						//self.$elem.prepend( jletter );
					
					
						self.reps += 1
					}
					else
					{
						if(self.config.infinite)
						{
						self.reps = 0;
						self.repeating = true
						}
						else
						{
						cancelRequestAnimFrame(self.request);
						}
					}
		},
		
		
		
		_leftText: function (  )
		{
			var self = this
			//var Otext=cont1.text();
			//var c = self.config.text.split("");
			var i=0;
			var end = self.letters.length;
			var removelast = false;
			self.timer = setInterval( show, self.config.speed );
			
			if(self.wasPaused)
			{
				self.wasPaused = false
				var i = self.incLetter;
				
				
				//i = i+1
				//if(i <= 0)
				//i = self.letters.length-1;
				//var l = i;
				//if(self.repeating)
				//var removelast = true;
				//var end = c.length-1 - i
			}
			//self.timer = setTimeout(function doStuff() {
				// here comes ajax functions and so on.
			//	show()
			//	setTimeout(doStuff, self.config.speed );
			//}, self.config.speed );
			
			function show(){
				if( i < end )
				{	
					
					if(self.repeating)
					{
						//if(i > 10)
						//console.log( $('.fonteo-letter:last').text() )
						//self.$elem.find('.'+self.config.className+':first').remove()
						//var ltrOut = self._getEdgeLetter(0, 1)
						var ltrOut = self._getEdgeLetter(-1, -1)
						
						if( self.config.letterOut && typeof self.config.letterOut === 'function' )
						{
							//var ltrOut = self._firstLetter(0)
							
							//if(ltrOut.is(':animated'))
							//{
							
							//var ltrOut = self.$elem.find('.'+self.config.className+'').eq(-2)
							
							//if(ltrOut.is(':animated'))
							//console.log('aaaaaanimated');
							//}
							//else
							//{}
							
							self.config.letterOut( ltrOut )
						}
						else
						{
							ltrOut.remove()
						}
					}
				
					var jletter = self._createLetter( self.letters[i] )
					
					self.$elem.append( jletter );
					
					
					//cont2.prepend( ocn );
					i=i+1;
				}
				else
				{
					
					self.repeating = true
					//console.log(354)
					
					if(self.config.infinite)
					{
					//removelast = true
					//self.$elem.text("")
					i=0
					}
					else
					{
					clearTimeout( self.timer );
					//clearTimeout( Otimer );
					self._onComplete()
					}
				}
				
				self.incLetter = i
				
				
			};
					
		},
		

		
		
		
		_rightText: function()
		{
			var self = this
			//var Otext=cont1.text();
			//var c = self.config.text.split("");
			//if(self.config.direction == 'right')
			{
				var i = self.letters.length-1;
			}
			//else
			//{
			//	var i = 0;
			//}
			
			var l = i;
			//var end = 0
			
			//var removelast = false;
			
			if(self.wasPaused)
			{
				self.wasPaused = false
				var i = self.incLetter;
				
				//i = i-1
				
				
				//if( i >= self.letters.length )
				//i = self.letters.length - 1
				//if(i <= 0)
				//i = self.letters.length-1;
				//var l = i;
				//if(self.repeating)
				//var removelast = true;
				//var end = c.length-1 - i
			}
			
			//console.log( self.letters.length + " - " + i )
			//alert(self.config.speed) 
			self.timer = setInterval( show, self.config.speed );
			//self.timer = setTimeout( show, self.config.speed );
			//self.timer = setInterval( show, 1000 / 60 );
			
			//self.timer = setTimeout(function doStuff() {
				// here comes ajax functions and so on.
			//	show()
			//	setTimeout(doStuff, self.config.speed );
			//}, self.config.speed );

			function show(){
			

				//return
				
				if( i >= 0 )
				{	
					if( self.repeating )
					{
						
						var ltrOut = self._getEdgeLetter(-1, -1)
						//var ltrOut = self.$elem.find('.'+self.config.className+':last')
						if( self.config.letterOut && typeof self.config.letterOut === 'function' )
						{
							
							//if(ltrOut.is(':animated'))
							//{
							
							//var ltrOut = self.$elem.find('.'+self.config.className+'').eq(-2)
							
							//if(ltrOut.is(':animated'))
							//console.log('aaaaaanimated');
							//}
							//else
							//{}
							
							self.config.letterOut( ltrOut )
						}
						else
						{
							ltrOut.remove()
						}
					}
					//console.log( $('.fonteo-letter:last').text() )
					//self.$elem.find('.'+self.config.className+':last').remove()
					
					var jletter = self._createLetter( self.letters[i] )
					
					self.$elem.prepend( jletter );
					//cont2.prepend( ocn );
					
					i=i-1;
					
					
				}
				else
				{
					//console.log(i)
					
					self.repeating = true
					
					if(self.config.infinite)
					{
						//removelast = true
						//self.$elem.text("")
						i=l
						
					}
					else
					{
						clearTimeout( self.timer );
						self._onComplete()
					}
				}
				
				self.incLetter = i
				
			};
					
		},
		

		
		/*
		_createLetters: function( ii ){
			
			var self = this	
			self.letters = self.config.text.split("");
			self.$elem.text('')
			
			for(var i=ii+1; i < self.letters.length ; i++)
			{	
				var animate = false
				if( ii % 2 == 0 )
					animate = true
				var jletter = self._createLetter( self.letters[i], animate )

				self.$elem.append( jletter );
			}
		},
		*/
		
		_createLetter: function( letter, animate ){
			
			var self = this
			//var letter =  Ocontent[i]
			if(self.config.tpl)
			letter =  self.config.tpl.replace( '{{'+self.config.className+'}}', letter )
			//alert(letter)
			var jletter = $( letter )
			jletter.addClass( self.config.className )
			
			if( self.config.letterIn && typeof self.config.letterIn === 'function' )
			{
				self.config.letterIn( jletter )
			}
			
			/*
			jletter.animate({  borderSpacing: 45 }, {
				step: function(now,fx) {
				  //$(this).css('transform','rotate('+now+'deg)');  
					
					 $(this).css({
					  '-webkit-transform' : 'rotate(' + now + 'deg)',
					  '-moz-transform'    : 'rotate(' + now + 'deg)',
					  '-ms-transform'     : 'rotate(' + now + 'deg)',
					  '-o-transform'      : 'rotate(' + now + 'deg)',
					  'transform'         : 'rotate(' + now + 'deg)'
					});

				},
				duration:'slow'
			},'linear');
			*/
			
			return jletter;
		},	
		
		
		_onComplete: function(){
			
			var self = this
			
			if( self.config.complete && typeof self.config.complete == 'function' )
			{
				self.config.complete()
			}
		
		},
		
		/**
		 * Returns a random integer between min (inclusive) and max (inclusive)
		 * Using Math.round() will give you a non-uniform distribution!
		 */
		 _getRandomInt: function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},	
		
			
		_eventCallback : function( event ) {
			var self = this
			
			if(typeof self.config[ event ] === 'function')
			{
				//google.maps.event.addListener( mapObj, event, function(e) {
				//alert(1)
				//obj[event](e,mapObj) 
				//var data = self.serialize()
				//self.config[ event ] (data)
				
				//});
			}
				
		},
			
		_initEvents : function(){
		},

		
		pause : function(){
		
			var self = this
			if(self.moving)
			{
			cancelRequestAnimFrame(self.request);
			self.wasPaused = true
			}
		},

		unpause : function(){
			var self = this
			//self._loopRefresh()
			if(self.moving)
			{
			self.wasPaused = false
			cancelRequestAnimFrame( self.request );
			self._loop( )
			}
		},
		
		pause2 : function(){
			
			var self = this
			clearTimeout( self.timer );
			
			self.wasPaused = true
			//console.log( 1 )
			
		},
		
		unpause2 : function(){
			
			var self = this
			
			self._animate(false)
		},
		
		togglePause : function(){
			
			var self = this
			
			if(self.wasPaused)
			self.unpause()
			else
			self.pause()
		},
		
		resetAnimation : function(){
			
			var self = this
			
			self.config.letterIn = false
			self.config.letterOut = false
		},
		
		setDirection : function(dir){
			
			var self = this
			
			//self.pause()
			//clearTimeout( self.timer );
			//self.config.direction = dir
			
			//self.unpause()
			//self._animate()
			//self.config.letterOut = false
		},
		
		toggleDirection : function(){
			
			var self = this
			
			//alert(345)
			//clearTimeout( self.timer );
			//if(!self.repeating)
			//return;
			if(self.moving)
			{
				if( self.config.direction == 'right')
				self.config.direction = 'left';
				else
				self.config.direction = 'right';
			}
			//self.rep = Math.abs( self.reps - self.length  ) + 2
			//cancelRequestAnimFrame(self.request);
			
			//alert( self.config.direction )
			//self._loop()
			
			//alert( self.config.direction )
			//self.pause()
			//console.log( self.letters.length )
			//self.wasToggled = true
			//clearTimeout( self.timer );
			//self.config.direction = self.config.direction == 'left' ? 'right' : 'left'
			
			//self.unpause()
			//self._animate()
			//self.config.letterOut = false
		},
		
		
		animate : function(){
		
			var self = this
			
			var animated = false;
			
			self.$elem.find('.'+self.config.className).each(function(){
				if( $(this).is(':animated') )
					animated = true;
			})
		
			if( animated ) {
				//console.log('animated 1')
			}
			else
			{
				//console.log('animated 0')
				self.$elem.text('')
				//self._createTextDefault();
				self._animate()
			}
	
		}


	}
	
    // You don't need to change something below:
    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations and allowing any
    // public function (ie. a function whose name doesn't start
    // with an underscore) to be called via the jQuery plugin,
    // e.g. $(element).defaultPluginName('functionName', arg1, arg2)
    $.fn[pluginName] = function ( options ) {
        var args = arguments;

        // Is the first parameter an object (options), or was omitted,
        // instantiate a new instance of the plugin.
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {

                // Only allow the plugin to be instantiated once,
                // so we check that the element has no plugin instantiation yet
                if (!$.data(this, 'plugin_' + pluginName)) {
					
                    // if it has no instance, create a new one,
                    // pass options to our plugin constructor,
                    // and store the plugin instance
                    // in the elements jQuery data object.
                    $.data(this, 'plugin_' + pluginName, new fonteoPlugin( this, options ));
                }
            });

        // If the first parameter is a string and it doesn't start
        // with an underscore or "contains" the `init`-function,
        // treat this as a call to a public method.
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
			
            // Cache the method call
            // to make it possible
            // to return a value
            var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);

                // Tests that there's already a plugin-instance
                // and checks that the requested public method exists
                if (instance instanceof fonteoPlugin && typeof instance[options] === 'function') {
					//alert( options )
                    // Call the method of our plugin instance,
                    // and pass it the supplied arguments.
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }

                // Allow instances to be destroyed via the 'destroy' method
                if (options === 'destroy') {
                  $.data(this, 'plugin_' + pluginName, null);
                }
            });

            // If the earlier cached method
            // gives a value back return the value,
            // otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }
    };

}(jQuery, window, document));


