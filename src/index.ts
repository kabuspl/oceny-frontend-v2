import { getDayDiffForDate, getLatestDate } from "./apiv1";
import { DayDiff } from "./types";

const gradeCounter = document.querySelector("#grades-count");
const gradeDetails = document.querySelector("#grades-details");

async function start() {
    let latestDate = await getLatestDate();
    updateUI(latestDate);
}

async function updateUI(date: Date) {
    let data = await getDayDiffForDate(date);
    if(!data) return false;
    let daydiff: DayDiff = data;
    gradeCounter.textContent = daydiff["Matematyka"][1].toString();
}

start();