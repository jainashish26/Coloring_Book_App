$(function(){
    $("#container").colourfill({
        buttons: ".colourButtons > li > button", 
        colourableElements: "#imageHolder path, #imageHolder ellipse, #imageHolder circle, #imageHolder rect, #imageHolder polygon", 
        resetButton:'.reset',
        undoButton:'.undo',
        fillType: "fill",
        
    });
});