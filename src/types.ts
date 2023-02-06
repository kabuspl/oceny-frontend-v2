export type DayDiff = {
    [subject: string]: number
};

export type ApiData = {
    success: boolean,
    data?: DayDiff
}