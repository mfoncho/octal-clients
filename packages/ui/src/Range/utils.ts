export function asc(a: number, b: number) {
    return a - b;
}

export function capitalize(word: string): string {
    return `${word[0].toUpperCase()}${word.substring(1)}`;
}

export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(min, value), max);
}

export function findClosest(values: number[], currentValue: number) {
    const { index: closestIndex } = values.reduce((acc, value, index) => {
        const distance = Math.abs(currentValue - value);

        if (
            acc === null ||
            distance < acc.distance ||
            distance === acc.distance
        ) {
            return {
                distance,
                index,
            };
        }

        return acc;
    }, (null as unknown) as { distance: number; index: number });
    return closestIndex;
}

export function trackFinger(event: any, touchId: any) {
    if (touchId.current !== undefined && event.changedTouches) {
        for (let i = 0; i < event.changedTouches.length; i += 1) {
            const touch = event.changedTouches[i];
            if (touch.identifier === touchId.current) {
                return {
                    x: touch.clientX,
                    y: touch.clientY,
                };
            }
        }

        return false;
    }

    return {
        x: event.clientX,
        y: event.clientY,
    };
}

export function valueToPercent(value: number, min: number, max: number) {
    return ((value - min) * 100) / (max - min);
}

export function percentToValue(percent: number, min: number, max: number) {
    return (max - min) * percent + min;
}

export function getDecimalPrecision(num: number) {
    // This handles the case when num is very small (0.00000001), js will turn this into 1e-8.
    // When num is bigger than 1 or less than -1 it won't get converted to this notation so it's fine.
    if (Math.abs(num) < 1) {
        const parts = num.toExponential().split("e-");
        const matissaDecimalPart = parts[0].split(".")[1];
        return (
            (matissaDecimalPart ? matissaDecimalPart.length : 0) +
            parseInt(parts[1], 10)
        );
    }

    const decimalPart = num.toString().split(".")[1];
    return decimalPart ? decimalPart.length : 0;
}

export function roundValueToStep(value: number, step: number, min: number) {
    const nearest = Math.round((value - min) / step) * step + min;
    return Number(nearest.toFixed(getDecimalPrecision(step)));
}

export function setValueIndex({ values, source, newValue, index }: any) {
    // Performance shortcut
    if (values[index] === newValue) {
        return source;
    }

    const output = values.slice();
    output[index] = newValue;
    return output;
}

export function focusThumb({ sliderRef, activeIndex, setActive }: any) {
    if (
        !sliderRef.current.contains(document.activeElement) ||
        Number(document.activeElement?.getAttribute("data-index")) !==
            activeIndex
    ) {
        sliderRef.current
            .querySelector(`[role="slider"][data-index="${activeIndex}"]`)
            .focus();
    }

    if (setActive) {
        setActive(activeIndex);
    }
}

export const axisProps = {
    offset: (percent: number) => ({ left: `${percent}%` }),
    leap: (percent: number) => ({ width: `${percent}%` }),
};

export function setRef(ref: any, value: any) {
    if (typeof ref === "function") {
        ref(value);
    } else if (ref) {
        ref.current = value;
    }
}
