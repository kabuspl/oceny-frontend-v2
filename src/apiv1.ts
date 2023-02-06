import { ApiData, DayDiff, FullDayDiff } from "./types";

export async function getDayDiffForDate(date: Date) {
    let data: ApiData = await fetch(process.env.API_ENDPOINT+"/v1/getDayDiffForDate/"+date.toISOString().substring(0,10)).then(data=>data.json());
    if(!data.success) return false;
    let daydiff: DayDiff = data.data as DayDiff;
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

export async function getFullDayDiff() {
    let data: ApiData = await fetch(process.env.API_ENDPOINT+"/v1/getArchivalDayDiff").then(data=>data.json());
    if(!data.success) return false;
    let fulldaydiff: FullDayDiff = data.data as FullDayDiff;
    return fulldaydiff;
}