import { getDayDiffForDate, getFirstDate, getLatestDate } from "./apiv1";
import { DayDiff } from "./types";

const gradeCounter = document.querySelector("#grades-count");
const gradeDetails = document.querySelector("#grades-details");

const backArrow = document.querySelector("#back");
const dateDisplay = document.querySelector("#date-display");
const forwardArrow = document.querySelector("#forward");

let currentDate: Date, latestDate: Date, firstDate: Date;

backArrow.addEventListener("click",()=>{
    let tempdate = new Date(currentDate.getTime());
    tempdate.setDate(currentDate.getDate()-1);
    if(tempdate<firstDate) return;
    currentDate.setDate(currentDate.getDate()-1)
    dateDisplay.textContent = currentDate.toISOString().substring(0,10)
    updateUI(currentDate);
});
forwardArrow.addEventListener("click",()=>{
    let tempdate = new Date(currentDate.getTime());
    tempdate.setDate(currentDate.getDate()+1);
    if(tempdate>latestDate) return;
    currentDate.setDate(currentDate.getDate()+1)
    dateDisplay.textContent = currentDate.toISOString().substring(0,10)
    updateUI(currentDate);
});

async function start() {
    latestDate = await getLatestDate();
    firstDate = await getFirstDate();
    currentDate = new Date(latestDate.getTime());
    dateDisplay.textContent = currentDate.toISOString().substring(0,10)
    updateUI(currentDate);
}

async function updateUI(date: Date) {
    let data = await getDayDiffForDate(date);
    if(!data) return false;
    let daydiff: DayDiff = data;
    gradeCounter.textContent = daydiff["Matematyka"][1].toString();
}

start();