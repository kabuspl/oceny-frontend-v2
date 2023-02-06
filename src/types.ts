export type DayDiff = {
    [subject: string]: {
        1: number,
        2: number,
        3: number,
        4: number,
        5: number,
        6: number
    }
};

export type ApiData = {
    success: boolean,
    data?: DayDiff
}