export const getLineChartPosition = (
    point: number[],
    params: unknown,
    dom: unknown,
    rect: unknown,
    size: { contentSize: number[] }
) => {
    // 鼠标坐标和提示框位置的参考坐标系是：以图表外层div的左上角那一点为原点，x轴向右，y轴向下
    // 提示框位置
    let x = 0; // x坐标位置
    let y = 0; // y坐标位置

    // 当前鼠标位置
    const pointX = point[0];
    const pointY = point[1];
    // 提示框大小
    const boxWidth = size.contentSize[0];
    const boxHeight = size.contentSize[1];
    // boxWidth > pointX 说明鼠标左边放不下提示框
    if (boxWidth > pointX) {
        x = pointX + 10;
    } else {
        // 左边放的下
        x = pointX - boxWidth - 10;
    }
    y = pointY - Math.round(boxHeight / 2);
    return [x, y];
};
