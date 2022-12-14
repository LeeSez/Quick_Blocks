import './style.css'

let miliseconds = 500;
let referenceArray: HTMLDivElement[] = [];
let blockArray:block[] = [];
let plusOneArray:HTMLElement[] = [];
let mainContainerRef:HTMLElement | null = document.getElementById("mainContainer");
let blocksContainerRef:HTMLElement | null = document.getElementById("blocksContainer");
let pScore:HTMLElement | null = document.getElementById("score");
let scoreContainer: HTMLElement | null = document.getElementById("scoreContainer");
let pCountDown: HTMLElement | null = document.getElementById("countDown");
let pNumOne: HTMLElement | null = document.getElementById("numOne");
let pNumTwo: HTMLElement | null = document.getElementById("numTwo");
let pNumThree: HTMLElement | null = document.getElementById("numThree");
let divNameContainer: HTMLElement | null = document.getElementById("nameContainer");
let inputPlayersName: HTMLElement | null = document.getElementById("playersName");

if(parseInt(localStorage["numOne"])<0){
  localStorage.setItem("numOne","0");
  localStorage.setItem("numOneName", "");
  localStorage.setItem("numTwo","0");
  localStorage.setItem("numTwoName", "");
  localStorage.setItem("numThree","0");
  localStorage.setItem("numThreeName", "");
}

let score = 0; 
let firstPlay = true;
let shouldPlay = false;
let strPlayersName:string = "";

let colorArray = ["#5FAD56","#F2C14E","#F78154","#D4CBE5","#6DB1BF","#BEFFC7","#044389","#9D6381","#EF7A85"];

if(scoreContainer) scoreContainer.onclick = divideModes; 
if(inputPlayersName) inputPlayersName.onkeydown = changeName;

createblocks(9);
updateLocalStorage();

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
  if(miliseconds>250) miliseconds -= 0.05;
  else miliseconds -= 0.03;
  if(miliseconds>50){
    setTimeout(()=>{
      render();
    },1);
  }
  else{
    shouldPlay = false;
    openNameInput();
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
  if(shouldPlay){
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
    if(scoreContainer) scoreContainer.style.left = "10vw";
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

function updateLocalStorage():void{
  if(!firstPlay){
    if(score > parseInt(localStorage["numOne"])){
      localStorage["numThree"] = localStorage["numTwo"];
      localStorage["numTwo"] = localStorage["numOne"];
      localStorage["numOne"] = score +"";

      localStorage["numThreeName"] = localStorage["numTwoName"];
      localStorage["numTwoName"] = localStorage["numOneName"];
      localStorage["numOneName"] = strPlayersName;
    }
    else if(score > parseInt(localStorage["numTwo"])){
      localStorage["numThree"] = localStorage["numTwo"];
      localStorage["numTwo"] = score +"";

      localStorage["numThreeName"] = localStorage["numTwoName"];
      localStorage["numTwoName"] = strPlayersName;
    }
    else if(score > parseInt(localStorage["numThree"])){
      localStorage["numThree"] = score +"";

      localStorage["numThreeName"] = strPlayersName;
    }
  }
  if(pNumOne) pNumOne.innerHTML = localStorage["numOne"] + " " + localStorage["numOneName"];
  if(pNumTwo) pNumTwo.innerHTML = localStorage["numTwo"] + " " + localStorage["numTwoName"];
  if(pNumThree) pNumThree.innerHTML = localStorage["numThree"] + " " + localStorage["numThreeName"];
}

function reset():void{
  miliseconds = 500;
  for(let i = 0; i<referenceArray.length; i++){
    blockArray[i].visible = false;
    referenceArray[i].style.backgroundColor = colorArray[i]+"33";
    plusOneArray[i].style.visibility = "hidden";
  }
}

function changeName(event:KeyboardEvent):void{
  divNameContainer?.classList.remove("nameOpen");
  if(event.key == "Enter"){
    let tempInput = <HTMLInputElement>inputPlayersName;
    strPlayersName = tempInput.value;

    tempInput.value = "Saved!";
    setTimeout(()=>{
      tempInput.value = strPlayersName;
    },5000);

    if(!shouldPlay) updateLocalStorage();
  }
}

function openNameInput():void{
  divNameContainer?.classList.add("nameOpen");
}

interface block{
  runTime:number,
  visible:boolean
}