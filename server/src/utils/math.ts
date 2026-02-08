export type TrendType = {
    percentage: number,
    isPositive: boolean,
    diff: number
}

export function calculateTrend(current: number, previous: number) : TrendType {
    if(previous === 0){
        return {
            percentage: current > 0 ? 100 : 0,
            isPositive: current > 0,
            diff: current
        }
    }
    const diff = current - previous;
    const percentage = (diff / previous) * 100;

    return {
        percentage: Math.round(percentage * 10) / 10,
        isPositive: diff >= 0,
        diff: diff
    }
}