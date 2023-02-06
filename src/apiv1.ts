import { ApiData, DayDiff } from "./types";

export async function getDayDiffForDate(date: Date) {
    let data: ApiData = await fetch(process.env.API_ENDPOINT+"/v1/getDayDiffForDate").then(data=>data.json());
    if(!data.success) return false;
    let daydiff: DayDiff = data.data;
    return daydiff;
}