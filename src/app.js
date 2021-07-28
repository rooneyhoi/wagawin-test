let imgURL, rowNumber, colNumber, countdownNumber, sliceImgWidth, sliceImgHeight, divPosition, divSufflePosition, infiniteLoop, originXY, timeoutFlag, secondCounter, playerStep;
const originImage = new Image();
const imagePuzzle = document.getElementById('imagePuzzle');
const flightZoneX = imagePuzzle.clientLeft;
const flightZoneY = imagePuzzle.offsetTop;
const flightZoneMaxX = imagePuzzle.clientWidth;
const flightZoneMaxY = imagePuzzle.clientHeight;
const btnUpdate = document.getElementById('buttonUpdate');
const modalBox = document.getElementById('modalBox');
const modalContent = document.getElementById('modalContent');
const timePointer = document.getElementById('pointer');
btnUpdate.addEventListener('click', buttonUpdateClick);

const puzzle = {
  width: 600,
  height: 400
}

window.onload = () => {
  getFormValues();
}

window.ontouchstart = function(event) {
  if (event.touches.length > 1) { //If there is more than one touch
      event.preventDefault();
  }
}

function countdownStart() {  
    if (countdownNumber > 0) {
      modalBox.style.display = 'block';
      modalContent.innerText =  countdownNumber == 1? 'Ready!' : countdownNumber - 1;
      countdownNumber--;
      setTimeout(countdownStart, 1000);
    }
    else {
      modalBox.style.display = 'none';         
    }
}

function getFormValues (){ 
  imgURL = document.getElementById('imageURL').value;
  rowNumber = document.getElementById('rowNumber').value;
  colNumber = document.getElementById('colNumber').value;  

  if (imgURL == ''){
    imgURL = 'https://s3-eu-west-1.amazonaws.com/wagawin-ad-platform/media/testmode/banner-landscape.jpg';
  }

  if (screen.availWidth < 800 ){
    puzzle.width = screen.availWidth;
  } else {
    puzzle.width = 600;
  }

  originImage.src = imgURL;
  originImage.width = puzzle.width;
  originImage.height = puzzle.height;  
}

function checkIsNumber(){
  if (
    isNaN(rowNumber) || rowNumber < 1 || rowNumber > 10 ||
    isNaN(colNumber) || colNumber < 1 || colNumber > 10) {
      rowNumber = 3;
      colNumber = 4;
      return false;
  } else
    return true;
}

// START the game
function startGame(){
  playerStep = 0;
  countdownNumber = 4;
  secondCounter = 60;
  countdownStart();
  getFormValues();
  checkIsNumber();
  createImagePuzzle();
  timeCounter();
  isEqual(); 
}

function buttonUpdateClick(){  
  startGame();
}

function createImagePuzzle(){
  divPosition = [];    
  imagePuzzle.innerHTML = '';
  let sliceImgId = 0
  sliceImgWidth = Math.floor(puzzle.width / colNumber);
  sliceImgHeight = Math.floor(puzzle.height / rowNumber);

  for (let i = 0; i < rowNumber; i++){
    for (let j = 0; j < colNumber; j++){      
      let sliceImgDiv = document.createElement('div');
      let originID = 'puzzle_' + sliceImgId;
      sliceImgDiv.id = originID;
      sliceImgDiv.style.width = sliceImgWidth + 'px';
      sliceImgDiv.style.height = sliceImgHeight + 'px';

      const xPos = i * sliceImgHeight;
      const yPos = j * sliceImgWidth;
      divPosition.push({originID, xPos, yPos, sliceImgId});
      sliceImgDiv.style.position = 'absolute';
      sliceImgDiv.style.top = xPos + 'px';
      sliceImgDiv.style.left = yPos + 'px';
      sliceImgDiv.style.zIndex = 0;
      
      sliceImgDiv.setAttribute('draggable', 'true');
      sliceImgDiv.setAttribute('index-value', sliceImgId);
      sliceImgDiv.className = 'puzzle';

      const xBackgroudPos = j * (-sliceImgWidth) + 'px';
      const yBackgroundPos = i * (-sliceImgHeight) + 'px';
      sliceImgDiv.style.backgroundImage = 'url(' + originImage.src + ')';
      sliceImgDiv.style.backgroundSize = originImage.width + 'px' + ' ' + originImage.height + 'px';
      sliceImgDiv.style.backgroundPosition = xBackgroudPos + ' ' + yBackgroundPos;      

      imagePuzzle.appendChild(sliceImgDiv);
      sliceImgId++;
    }
  }  
  sufflePuzzleImage();
  addDraggableEvent();   
}

function sufflePuzzleImage(){    
  divSufflePosition = [...divPosition];  
  divSufflePosition.sort(() => Math.random() - 0.5);  
  
  for (let i = 0; i < imagePuzzle.children.length; i++){    
    imagePuzzle.children[i].style.top = divSufflePosition[i].xPos + 'px';
    imagePuzzle.children[i].style.left = divSufflePosition[i].yPos + 'px';
    imagePuzzle.children[i].setAttribute('index-value', divSufflePosition[i].sliceImgId);
  }
  
  updateDivSufflePosition();
}

// Add event to the puzzle elements
function addDraggableEvent(){
  const Puzzles = document.querySelectorAll('.puzzle');  
  Puzzles.forEach(puzzle => {

    // Drag events
    puzzle.addEventListener('dragstart', dragStart);
    puzzle.addEventListener('dragenter', dragEnter);
    puzzle.addEventListener('dragover', dragOver);
    puzzle.addEventListener('dragleave', dragLeave);
    puzzle.addEventListener('dragend', dragEnd);
    puzzle.addEventListener('drop', drop);

    // Touch events
    puzzle.addEventListener('touchstart', touchStart);
    puzzle.addEventListener('touchend', touchEnd);
    puzzle.addEventListener('touchmove', touchMove);

    // // Mouse events
    // puzzle.addEventListener('mousedown', touchStart);
    // puzzle.addEventListener('mouseup', touchEnd);
    // puzzle.addEventListener('mouseleave', touchEnd);
    // puzzle.addEventListener('mousemove', touchMove);
  });
}

function touchStart(ev){
    console.log('start');
}

function touchMove(ev){
  // grab the location of touch
  const touchLocation = ev.targetTouches.length > 0 ? ev.targetTouches.item(0) : ev.touches.item(0);
  const touchedElement = ev.target.id;
  const moveDiv = document.getElementById(touchedElement);    
  moveDiv.style.zIndex = 2;
  moveDiv.setAttribute('transition', '0s');
  moveDiv.classList.add('touchMove');

  // assign box new coordinates based on the touch.
  moveDiv.style.left = touchLocation.pageX - flightZoneX - 50 + 'px';
  moveDiv.style.top = touchLocation.pageY - flightZoneY - 50 + 'px';
}

function touchEnd(ev){
  let originX, originY;
  const touchedElement = ev.target.id;     
  const moveDiv = document.getElementById(touchedElement);
  const sourceIndex = moveDiv.getAttribute('index-value');
  moveDiv.setAttribute('transition', 0.5);

  for (let i = 0; i < originXY.length; i++){
    if (touchedElement == originXY[i].puzzleID){
      originX = originXY[i].posLeft;
      originY = originXY[i].posTop;
    }
  }

  // get new position of puzzle
  const currentLeft = parseInt(moveDiv.style.left);
  const currentTop = parseInt(moveDiv.style.top);

  // check if it's moving out of range
  if(currentLeft < flightZoneX || currentLeft > flightZoneMaxX || 
    (currentTop + flightZoneY) < flightZoneY || currentTop > flightZoneMaxY){
    moveDiv.style.left = originX;
    moveDiv.style.top = originY;
  } else {
    // check and replace puzzle places
    let check = 0
    for (let i = 0; i < divSufflePosition.length; i++){
      const targetPuzzleX = parseInt(divSufflePosition[i].posLeft);
      const targetPuzzleY = parseInt(divSufflePosition[i].posTop);
      const targetIndex = divSufflePosition[i].indexValue; 
      const targetId = divSufflePosition[i].puzzleID;
 
      if (currentLeft >= targetPuzzleX && currentLeft < (targetPuzzleX + sliceImgWidth)
        && currentTop >= targetPuzzleY && currentTop < (targetPuzzleY + sliceImgHeight)){  
          
          const targetPuzzle = document.getElementById(targetId);
          targetPuzzle.style.left = originX;
          targetPuzzle.style.top = originY;
          targetPuzzle.setAttribute('index-value', sourceIndex);

          moveDiv.style.left = targetPuzzleX + 'px';
          moveDiv.style.top = targetPuzzleY + 'px';
          moveDiv.setAttribute('index-value', targetIndex);

          playerStep += 1;
      }
    }  
  }
  
  moveDiv.style.zIndex = 0;
  moveDiv.classList.remove('touchMove');
  updateDivSufflePosition();    
}

function switchPuzzlePosition(sourcePuzzleID, targetPuzzleID){
  // to optimize the switch of puzzle image in both drag & drop and touch end 
 }

 // can't use in isEqual function because when player in mobile & touch mode, the xPos and yPos is contantly updated.
function updateDivSufflePosition(){
  originXY = [];
  divSufflePosition = [];  
  const Puzzles = document.querySelectorAll('.puzzle');

  Puzzles.forEach(puzzle => {    
    const puzzleID = puzzle.id;
    const indexValue = puzzle.getAttribute('index-value');
    const posLeft = puzzle.style.left
    const posTop = puzzle.style.top;
    const puzzleWidth = puzzle.style.width;
    const puzzleHeight = puzzle.style.height;
    divSufflePosition.push({puzzleID, indexValue, posLeft, posTop, puzzleWidth, puzzleHeight});
  })

  originXY = [...divSufflePosition];
}

function dragStart(ev){  
  ev.target.classList.add('drag-start');
  ev.dataTransfer.setData('text', ev.target.id);
}

function dragEnter(ev){
  if(!ev.target.classList.contains('drag-start')) {
    ev.target.classList.add('drag-enter');
  }
}

function dragOver(ev){
  ev.preventDefault();
}

function dragLeave(ev){
  ev.target.classList.remove('drag-enter');
}

function dragEnd(ev){
  ev.target.classList.remove('drag-start');
}

function drop(ev) {  
  ev.preventDefault();
  ev.target.classList.remove('drag-enter');

  // get data of source and target  
  const sourcePuzzleID = ev.dataTransfer.getData('text');
  const sourcePuzzle = document.getElementById(sourcePuzzleID);
  const sourceIndex = sourcePuzzle.getAttribute('index-value'); 
  
  const targetPuzzleID = ev.target.id;   
  console.log(sourcePuzzleID, targetPuzzleID);

  if(sourcePuzzleID != targetPuzzleID){     
    // collect the target puzzle Position
    const targetPuzzleX = ev.target.style.left;
    const targetPuzzleY = ev.target.style.top;
    const targetIndex = ev.target.getAttribute('index-value'); 

    // change the top and left of the target puzzle
    ev.target.style.top = sourcePuzzle.style.top;
    ev.target.style.left = sourcePuzzle.style.left;
    ev.target.setAttribute('index-value', sourceIndex);

    // change the top and left of the source puzzle
    sourcePuzzle.style.left = targetPuzzleX;
    sourcePuzzle.style.top = targetPuzzleY; 
    sourcePuzzle.setAttribute('index-value', targetIndex);

    playerStep += 1;
  }

  updateDivSufflePosition();  
}

function checkResult(firstArray, secondArray){
  let check = true;   

  for(var i=0; i<firstArray.length; i++) {    
    let originID = firstArray[i].originID;
    let originIndex = firstArray[i].sliceImgId;    
    
    if( originID != secondArray[i].puzzleID || originIndex != secondArray[i].indexValue){
      check = false;       
    }
  }    
  return check;
}

function showMessage(message){
  const stepsMessage = document.createElement('p');
  stepsMessage.innerText = 'Your steps: ' + playerStep;
  stepsMessage.classList.add('stepMessage');

  const span = document.getElementsByClassName('close')[0];
  const modalMessage = document.getElementById('modalMessage');
  const modalMessContent = document.getElementById('modalMessContent');
  
  modalMessContent.innerText =  message;  
  modalMessContent.appendChild(stepsMessage);
  modalMessage.style.display = 'block';
  timePointer.style.display = 'none';
  span.onclick = () => {modalMessage.style.display = 'none';}  
}

function isEqual (){     
  let checkEqual = checkResult(divPosition, divSufflePosition);    

  if(!timeoutFlag){
    showMessage('Sorry! You loose the game');       
    cancelAnimationFrame(isEqual);
    return;
  }

  if (checkEqual){
    showMessage('Congrats! You won the game');       
    cancelAnimationFrame(isEqual);  
    secondCounter = 0;
  } else {    
    requestAnimationFrame(isEqual);
  }
  console.log(checkEqual);
}

function timeCounter() {    
  timeoutFlag = true;
  secondCounter += countdownNumber;

  const checkViewPort = window.matchMedia("(max-width: 800px)")
  if (!checkViewPort.matches){
    timePointer.style.display = 'block';
  }

  function tick() {    
    if(secondCounter <= 60){
      document.getElementById('timeCounter').innerHTML = (secondCounter < 10 ? "0" : "") + String(secondCounter);    
    }    
    secondCounter--;    

    if( secondCounter >= 0 ) {
        setTimeout(tick, 1000);
    } else {
      timeoutFlag = false;
      document.getElementById('timeCounter').innerHTML = '0:0';     
    }
  }
  tick();
}
