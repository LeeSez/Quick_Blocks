import './style.css'

let miliseconds = 500;
let referenceArray: HTMLDivElement[] = [];
let blockArray:block[] = [];
let plusOneArray:HTMLElement[] = [];
let mainContainerRef:HTMLElement | null = document.getElementById("mainContainer");
let blocksContainerRef:HTMLElement | null = document.getElementById("blocksContainer");
let pScore:HTMLElement | null = document.getElementById("score");
let balloonRef: HTMLElement | null = document.getElementById("balloon");
let scoreContainer: HTMLElement | null = document.getElementById("scoreContainer");
let pCountDown: HTMLElement | null = document.getElementById("countDown");

let score = 0; 
let firstPlay = true;
let shouldPlay = false;

let colorArray = ["#5FAD56","#F2C14E","#F78154","#D4CBE5","#6DB1BF","#BEFFC7","#044389","#9D6381","#EF7A85"];

if(scoreContainer) scoreContainer.onclick = divideModes; 

createblocks(9);

function render():void{
  if(!shouldPlay) return;
  for(let i = 0; i<blockArray.length; i++){
    if(blockArray[i].runTime>0){
      blockArray[i].runTime--;
    }
    else if(blockArray[i].visible && (blockArray[i].runTime < 0 || blockArray[i].runTime ==0)){
      blockArray[i].visible = false;
      referenceArray[i].style.backgroundColor = colorArray[i]+"33";
      plusOneArray[i].style.visibility = "hidden";

      resetPlusOneArray();
      selectBlockToShow(1);
    }
  }
  miliseconds -= 0.05;
  if(miliseconds>30){
    setTimeout(()=>{
      render();
    },1);
  }
}

function selectBlockToShow(amount:number):void{
  for(let i =0; i<amount; i++){
    let selectedIndex = Math.floor(Math.random()*blockArray.length);
    if(blockArray[selectedIndex].visible == false){
      blockArray[selectedIndex].visible = true;
      referenceArray[selectedIndex].style.backgroundColor = colorArray[selectedIndex]+"ff";
      blockArray[selectedIndex].runTime = miliseconds;
    }
    else i--;
  }
}

function createblocks(amount:number):void{
  for(let i = 0; i<amount; i++){
    //element creation
    let tempElement = document.createElement("div");
    tempElement.className = "block";
    tempElement.onclick = blockClicked;
    styleBlocks(tempElement, colorArray[i], i/3+1, i%3+1);
    referenceArray.push(tempElement);
    createPlusOne(tempElement);
    if(blocksContainerRef) blocksContainerRef.appendChild(tempElement);

    //objects creation
    let tempObj:block = {
      runTime: 0,
      visible: false
    };
    blockArray.push(tempObj);
  }
}

function styleBlocks(element:HTMLDivElement, color:string, row:number, column:number):void{
  element.style.backgroundColor = color+"33";
  element.style.gridRow = row + "/" + row;
  element.style.gridColumn = column + "/" + (column+1);
}

function createPlusOne(element:HTMLDivElement):void{
  let plusOne = document.createElement("p");
  plusOne.innerHTML = "+1";
  plusOne.className = "one";
  element.appendChild(plusOne);
  plusOneArray.push(plusOne);
}

function blockClicked(event:Event):void{
  let index = event.target === null ? -1 : referenceArray.indexOf(event.target as HTMLDivElement);
  if(blockArray[index].visible){
    if(index > -1) plusOneArray[index].style.visibility = "visible";
    score++;
  }
  else{
    plusOneArray[index].innerHTML = "-1";
    if(index > -1) plusOneArray[index].style.visibility = "visible";
    if(score > 0) score--;
  }
  if(pScore) pScore.innerHTML = score+"";
}

function resetPlusOneArray():void{
  for(let i = 0; i<plusOneArray.length; i++){
    plusOneArray[i].style.visibility = "hidden";
    plusOneArray[i].innerHTML = "+1";
  }
}

function balloonDown():void{ 
  scoreContainer?.classList.add("ballonDown");
  if(mainContainerRef) mainContainerRef.classList.add("mainContainerDown");

  setTimeout(()=>{
    if(scoreContainer) scoreContainer.style.left = "20vh";
    if(pScore) pScore.style.visibility = "visible";
    if(mainContainerRef) {
      mainContainerRef.style.top = "0";
      mainContainerRef.classList.remove("mainContainerDown");
    }
    score = 0;
    if(pScore) pScore.innerHTML = score + "";
  },2500)
  setTimeout(()=>{
    scoreContainer?.classList.remove("ballonDown");
    shouldPlay = true;
    countDown(4);
    if(pCountDown) pCountDown.style.visibility = "visible";
  },5000);
}

function countDown(count:number){
  if(count>1){
    count--;
    if(pCountDown) pCountDown.innerHTML = count+"";
    setTimeout(()=>{
      countDown(count);
    },1000)
  }
  else{
    if(pCountDown) pCountDown.style.visibility = "hidden";
    selectBlockToShow(3);
    render();
  }
}

function divideModes():void{
  shouldPlay = false;
  console.log("fdg");
  if(firstPlay){
    firstPlay = false;
    balloonDown();
  }
  else{
    if(mainContainerRef) mainContainerRef.classList.add("containerMoveLeft");
    setTimeout(()=>{
      if(mainContainerRef) {
        mainContainerRef.style.top = "100vh";
        mainContainerRef.style.left = "0";
        mainContainerRef.classList.remove("containerMoveLeft");
      }
      reset();
      balloonDown();
    },2000);
  }
}


function reset():void{
  miliseconds = 500;
  for(let i = 0; i<referenceArray.length; i++){
    blockArray[i].visible = false;
    referenceArray[i].style.backgroundColor = colorArray[i]+"33";
    plusOneArray[i].style.visibility = "hidden";
  }
}

interface block{
  runTime:number,
  visible:boolean
}