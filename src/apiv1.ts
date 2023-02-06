import { ApiData, DayDiff } from "./types";

export async function getDayDiffForDate(date: Date) {
    let data: ApiData = await fetch(process.env.API_ENDPOINT+"/v1/getDayDiffForDate/"+date.toISOString().substring(0,10)).then(data=>data.json());
    if(!data.success) return false;
    let daydiff: DayDiff = data.data;
    return daydiff;
}

export async function getLatestDate() {
    let data: ApiData = await fetch(process.env.API_ENDPOINT+"/v1/getDayDiff").then(data=>data.json());
    let latestDate = new Date(Object.keys(data.data).at(-1));
    return latestDate;
}

export async function getFirstDate() {
    let data: ApiData = await fetch(process.env.API_ENDPOINT+"/v1/getDayDiff").then(data=>data.json());
    let firstDate = new Date(Object.keys(data.data).at(0));
    return firstDate;
}