export interface ChartData  {
    labels?: string[],
    datasets?: Data[]
}

export interface Data {
    label?: string,
    data?: number[],
    fill?: boolean,
    borderColor?: string,
    tension?: number
}