import { ChartDataset } from "chart.js";

export type DayDiff = {
    [subject: string]: {
        grades: {
            [grade: number]: number
        },
        average: number
    }
};

export type FullDayDiff = {
    [date: string]: DayDiff
}

export type ApiData = {
    success: boolean,
    data?: DayDiff | FullDayDiff
}

export type GradesChartDatasets =
    {
    label: string,
    data: {
        x: string,
        y: number
    }[],
    fill: string
}[]

export type GradeCount = {
    [grade: number]: number
}