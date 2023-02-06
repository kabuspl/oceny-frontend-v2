export type DayDiff = {
    [subject: string]: {
        [grade: number]: number
    }
};

export type ApiData = {
    success: boolean,
    data?: DayDiff
}