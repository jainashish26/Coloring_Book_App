/*

colourfill v1.0

@desc Colouring plugin that allows you to colour in colourableElements based on specified "choose a color" buttons. Adapted from code used to build online colouring book website, colourfill.ca.

@author Audriana Andrews

Licensed under the MIT licence: http://www.opensource.org/licenses/mit-license.php
(c) Audriana Andrews 2016

DEFAULT OPTIONS
$([container]).colourfill({
        buttons: null,
        colourableElements: null,
        undoButton: null,
        resetButton: null, 
        fillType: "background-color", 
        buttonColourType: "background-color", 
        addColouredClass: "false" 
 });

ALL OPTIONS
buttons, colourableElements, undoButton, resetButton
Selectors you used to create these.

fillType, buttonColourType: {'background-color', 'fill'}
Choose what CSS property the colours for the "choose a colour" buttons and the lements you want to fill in come from.

addColouredClass: {'true', 'false'}
Add a coloured class to an element after it is coloured in.

*/

;(function ($, window, document, undefined ) {
    //Default settings
    var colourfill = 'colourfill', defaults = {  
        buttons: null, 
        colourableElements: null, 
        undoButton: null,
        resetButton: null,
        fillType: "background-color",
        buttonColourType: "background-color",
        addColouredClass: "false"
    };  
    
    function Colourfill( cf , options ){
        this.cf = cf;
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = colourfill;
        
        this.init();
    }
    
    Colourfill.prototype.init = function () {
        var base = this.cf;
        var prevColours = [];
        var resetColours = [];
        var partNum = 0;
        
        var buttons = this.options.buttons;
        var colourableElements = this.options.colourableElements;
        var fillType = this.options.fillType;
        var buttonColourType = this.options.buttonColourType;
        var undoButton = this.options.undoButton;
        var resetButton = this.options.resetButton;
        var addColouredClass = this.options.addColouredClass;
        
        $(this.cf).find(buttons).first().addClass('colourChosen');
        
        //Changing chosen colour
        $(this.cf).on('touchstart click tap', buttons, function () {
            $(base).find(buttons).removeClass("colourChosen");
            $(this).addClass("colourChosen");
        });
        
        $(this.cf).find(colourableElements).each(function () {
            var resetColour = $(this).css(fillType);
            resetColours.push([$(this), resetColour]);
            partNum += 1;
        });

        //Colouring in
        $(this.cf).on('touchstart click tap', colourableElements, function(e){
            var colourChosen = $(base).find(".colourChosen").css(buttonColourType);
            var prevColour = [$(this), $(this).css(fillType)];
            prevColours.push(prevColour);
            $(this).css(fillType, colourChosen);
            if(addColouredClass == "true"){
                var previousClasses = ($(this).attr('class') != 'undefined') ? $(this).attr("class") + " " : "";
                this.attr("class", previousClasses + "coloured");
            }
            e.stopPropagation();
            e.preventDefault();
            return false;
        });
        
        //Reset Button
        $(this.cf).on('touchstart click tap', resetButton, function () {
            $(base).find(colourableElements).each(function(){
                var prevColour = [$(this), $(this).css(fillType)];
                prevColours.push(prevColour);
            });
            if (resetColours.length > 0) {
                for (section in resetColours) {
                    $(resetColours[section][0]).css(fillType, resetColours[section][1]);
                }
            }
            $(base).find(resetButton).addClass("resetClicked");
        });
        
        //Undo Button
        $(this.cf).on('touchstart click tap', undoButton, function () {
            if ($(base).find(resetButton).hasClass("resetClicked")) {
                for(i = 0; i < partNum; i++) {
                    var currentElement = prevColours.pop();
                    $(currentElement[0]).css(fillType, currentElement[1]);
                }
                $(base).find(resetButton).removeClass("resetClicked");
            }
            else {
                if (prevColours.length > 0) {
                    var lastElement = prevColours.pop();
                    $(lastElement[0]).css(fillType, lastElement[1]);
                }
            }
        });
	};
    
    $.fn.colourfill = function(options){
        return this.each(function () {
            if (!$.data(this, 'plugin_' + colourfill)) {
                $.data(this, 'plugin_' + colourfill,
                new Colourfill( this, options ));
            }
        });
    };
}(jQuery));