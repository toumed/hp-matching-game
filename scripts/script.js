// JavaScript Document

class MatchGame {

	
	constructor(gameBoard, boxes, numBoxes, turnsOut, matchedOut, btnPlay, picFilename){
		
		// HTML Elements
		this.gameBoard = gameBoard;
		this.boxes = boxes;
		this.firstFlippedBox = null;
		this.secondFlippedBox = null;
		this.turnsOut = turnsOut;
		this.matchedOut = matchedOut;
		this.btnPlay = btnPlay;

		// Variables
		this.numBoxes = numBoxes;
		this.halfNumBoxes = numBoxes / 2;
		this.turns = 0;
		this.matches = 0;
		this.clickCounter = 0;
		this.picFilename = picFilename;
		this.pictures = [];
		this.firstFlippedPicture = null;
		this.secondFlippedPicture = null;
		
	}
	
	// Functions
	gameStart(){

		this.btnPlay.text('End');
		this.createPictures(this.picFilename);
		this.shufflePictures();
		this.addPictures(this.pictures, this.boxes);	
		this.gameBoard.removeClass('hide');

	} 
	
	gameEnd(isGameWon){

		this.gameBoard.addClass('hide');
		this.btnPlay.text('Begin');

		if(isGameWon === false){

			this.boxes.removeClass('flipped')
					  .removeClass('matched');

		}

		this.clickCounter = 0;
		this.turns = 0;
		this.matches = 0;
		this.matchedOut.text(0);
		this.turnsOut.text(0);
		this.destroyPictures();

	} 
	
	createPictures(picFilename){

		for(let i = 1; i <= this.halfNumBoxes; i++){
			if(i < 10){			
				this.pictures.push(picFilename + '0' + i + '.jpg');
				this.pictures.push(picFilename + '0' + i + '.jpg');

			}else{
				this.pictures.push(picFilename + i + '.jpg');
				this.pictures.push(picFilename + i + '.jpg');

			} 	
		} 

	} 
	
	shufflePictures(){

		let counter = this.pictures.length;
		let temp; 
		let i;

		while (counter > 0) {

			
			i = Math.floor(Math.random() * counter);

			counter--;

			temp = this.pictures[counter];
			this.pictures[counter] = this.pictures[i];
			this.pictures[i] = temp;

		} // end while

	} // end shufflePictures

	addPictures(thePictures, theBoxes){

		theBoxes.each(function(i){

			// create image
			const $theImg = $('<img>').attr('src', thePictures[i]);

			// get the box that we will add the image to		  
			const $theBox = $(this).find('.card-back');	
			// add image to the box	
			$theImg.appendTo($theBox);								  				  

		}); // end .each()

	} // end addPictures
	
	destroyPictures(){

		this.pictures.length = 0;
		$('.card-back img').remove();

	} // end destroyPictures
	
	gameTurn(box){

		// Get a reference to this...
		const that = this;

		if(box.hasClass('flipped')){

			return;

		} // end if box has class flipped or matched

		this.clickCounter++;

		if(this.clickCounter === 1){

			box.addClass('flipped');
			this.firstFlippedBox = box;
			this.firstFlippedPicture = box.find('.card-back img').attr('src');

			return;

		} // end if clickCounter === 1

		// CounterClicks equals 2 -> look for match
		if(this.clickCounter === 2){

			box.addClass('flipped');
			this.secondFlippedBox = box;
			this.secondFlippedPicture = box.find('.card-back img').attr('src');

		}	

		if(this.firstFlippedPicture === this.secondFlippedPicture){
			// they match
			this.firstFlippedBox.addClass('matched');
			this.secondFlippedBox.addClass('matched');
			this.clickCounter = 0;
			this.updateTurns();
			this.updateMatch();

			box.one('transitionend', function(){

				if(that.matches === that.halfNumBoxes){
					that.gameWon();
					return;
				}

			});		

		}else{
			// they do not match
			setTimeout(function(){
				that.updateTurns();
				that.firstFlippedBox.removeClass('flipped');
				that.secondFlippedBox.removeClass('flipped');
				that.clickCounter = 0;
			}, 750);
			
		} // end if images match or not...	

	} // end gameTurn

	updateTurns(){

		this.turns++;
		this.turnsOut.text(this.turns);

	} // end updateTurns
	
	updateMatch(){

		this.matches++;
		this.matchedOut.text(this.matches);

	} // end updateMatch
	
	gameWon(){

		const answer = confirm('Magical! You matched them all! Click OK to play again?');

		if(answer === true){

			const that = this;

			this.boxes.removeClass('flipped')
					  .removeClass('matched')
					  .one('transitionend', function(){
						  that.gameEnd(true);
						  that.gameStart();
						  that.boxes.off('transitionend');
					   });

		} // end if answer is true

	} // end gameWon
	
} // end Game Class

// Create instance of the MatchGame class
const mg = new MatchGame($('.game-board'), 
	                     $('.col'), 
	                     $('.col').length, 
	                     $('.output-turns p'), 
	                     $('.output-matched p'),
	                     $('.btn-play-and-reset'),
	                     'images/hp-');


// Game Event Handlers
mg.btnPlay.click(function(){

	if($(this).text() === 'Begin'){
		mg.gameStart();
	}else{
		mg.gameEnd(false);
	}

});

mg.boxes.click(function(){

	mg.gameTurn( $(this) );

});

$('.load').click(function () {
    $('.transition').fadeOut(1500);
});

// Audio
var myAudio = document.getElementById("myAudio");
function togglePlay(){
	return myAudio.paused ? myAudio.play() : myAudio.pause();
};
