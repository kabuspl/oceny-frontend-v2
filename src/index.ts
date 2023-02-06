import { getDayDiffForDate, getFirstDate, getLatestDate } from "./apiv1";
import { DayDiff } from "./types";

const gradeCounter = document.querySelector("#grades-count");
const gradeDetails = document.querySelector("#grades-details");

const backArrow = document.querySelector("#back");
const dateDisplay = document.querySelector("#date-display");
const datePicker: HTMLFormElement = document.querySelector("#date-picker");
const forwardArrow = document.querySelector("#forward");

dateDisplay.addEventListener("click",()=>{
    datePicker.showPicker();
})
datePicker.addEventListener("change", ()=>{
    currentDate=new Date(datePicker.value);
    updateUI(currentDate);
})

let currentDate: Date, latestDate: Date, firstDate: Date;

backArrow.addEventListener("click",()=>{
    let tempdate = new Date(currentDate.getTime());
    tempdate.setDate(currentDate.getDate()-1);
    if(tempdate<firstDate) return;
    currentDate.setDate(currentDate.getDate()-1)
    updateUI(currentDate);
});
forwardArrow.addEventListener("click",()=>{
    let tempdate = new Date(currentDate.getTime());
    tempdate.setDate(currentDate.getDate()+1);
    if(tempdate>latestDate) return;
    currentDate.setDate(currentDate.getDate()+1)
    updateUI(currentDate);
});

async function start() {
    latestDate = await getLatestDate();
    firstDate = await getFirstDate();
    datePicker.max = latestDate.toISOString().substring(0,10);
    datePicker.min = firstDate.toISOString().substring(0,10);
    currentDate = new Date(latestDate.getTime());
    updateUI(currentDate);
}

async function updateUI(date: Date) {
    dateDisplay.textContent = currentDate.toISOString().substring(0,10)
    let data = await getDayDiffForDate(date);
    if(!data) return false;
    let daydiff: DayDiff = data;
    let gradesCount = 0;
    for(let subject in daydiff) {
        let subjectGrades = daydiff[subject];
        for(let grade in subjectGrades) {
            let gradeCount: number = subjectGrades[parseInt(grade)];
            gradesCount+=gradeCount;
        }
    }
    gradeCounter.textContent = gradesCount.toString();
}

start();