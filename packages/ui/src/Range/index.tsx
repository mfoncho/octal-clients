import React from "react";
import clsx from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import {
    useControlled,
    useIsFocusVisible,
    useForkRef,
    useEventCallback,
} from "./hooks";
import {
    asc,
    trackFinger,
    valueToPercent,
    roundValueToStep,
    percentToValue,
    clamp,
    findClosest,
    focusThumb,
    setValueIndex,
    axisProps,
} from "./utils";
import ValueLabel from "./ValueLabel";

export interface IRange
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    type?: "range";
    min: number;
    max: number;
    value: number;
    step?: number;
    track?: string;
    valueLabelDisplay?: "on" | "auto" | "off";
    scale?: any;
    onChange: (e: React.ChangeEvent<{}>, value: number) => void;
    marks?: boolean | { value: number; label?: string | null }[];
    ThumbComponent?: any;
    valueLabelFormat?: any;
    ValueLabelComponent?: any;
}

const useStyles = makeStyles((theme: any) => ({
    /* Styles applied to the root element. */
    root: {
        color:
            "rgb(var(--color-primary-500-r), var(--color-primary-500-g), var(--color-primary-500-b))",
        height: 8,
        fontWeight: 600,
        width: "100%",
        boxSizing: "content-box",
        padding: "50px 0px 8px 0px",
        display: "inline-block",
        position: "relative",
        cursor: "pointer",
        touchAction: "none",
        WebkitTapHighlightColor: "transparent",
        "&$disabled": {
            pointerEvents: "none",
            cursor: "default",
            color: theme.palette.grey[400],
        },
        // The primary input mechanism of the device includes a pointing device of limited accuracy.
        "@media (pointer: coarse)": {
            // Reach 42px touch target, about ~8mm on screen.
            padding: "20px 0",
        },
        "@media print": {
            colorAdjust: "exact",
        },
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: "#fff",
        border: "2px solid currentColor",
        marginTop: -8,
        marginLeft: -12,
        "&:focus, &:hover, &$active": {
            boxShadow: "inherit",
        },
        position: "absolute",
        boxSizing: "border-box",
        borderRadius: "50%",
        outline: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: theme.transitions.create(["box-shadow"], {
            duration: theme.transitions.duration.shortest,
        }),
        "&::after": {
            position: "absolute",
            content: '""',
            borderRadius: "50%",
            // reach 42px hit target (2 * 15 + thumb diameter)
            left: -15,
            top: -15,
            right: -15,
            bottom: -15,
        },
        "&$focusVisible,&:hover": {
            "@media (hover: none)": {
                boxShadow: "none",
            },
        },
        "&$active": {},
        "&$disabled": {
            width: 8,
            height: 8,
            marginLeft: -4,
            marginTop: -3,
            "&:hover": {
                boxShadow: "none",
            },
        },
    },
    active: {},
    track: {
        height: 8,
        borderRadius: 4,
        display: "block",
        position: "absolute",
        backgroundColor: "currentColor",
    },
    rail: {
        height: 8,
        borderRadius: 4,
        display: "block",
        position: "absolute",
        width: "100%",
        backgroundColor: "currentColor",
        opacity: 0.38,
    },
    marked: {
        marginBottom: 20,
    },
    /* Pseudo-class applied to the root and thumb element if `disabled={true}`. */
    disabled: {},
    /* Styles applied to the rail element. */
    /* Styles applied to the track element. */
    /* Styles applied to the track element if `track={false}`. */
    /* Styles applied to the thumb element. */
    /* Pseudo-class applied to the thumb element if it's active. */
    /* Pseudo-class applied to the thumb element if keyboard focused. */
    focusVisible: {},
    /* Styles applied to the thumb label element. */
    /* Styles applied to the mark element. */
    mark: {
        position: "absolute",
        width: 8,
        height: 8,
        borderRadius: 8,
        backgroundColor: "currentColor",
    },
    /* Styles applied to the mark element if active (depending on the value). */
    markActive: {
        opacity: 0.8,
    },
    /* Styles applied to the mark label element. */
    markLabel: {
        position: "absolute",
        top: 26,
        transform: "translateX(-50%)",
        whiteSpace: "nowrap",
        "@media (pointer: coarse)": {
            top: 40,
        },
    },
    /* Styles applied to the mark label element if active (depending on the value). */
    markLabelActive: {},
}));

const Identity = (x: any) => x;

export default React.forwardRef<HTMLSpanElement, IRange>((props, ref) => {
    const classes = useStyles();
    const {
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledby,
        "aria-valuetext": ariaValuetext,
        className,
        color = "primary",
        defaultValue,
        disabled = false,
        marks: marksProp = false,
        max = 100,
        min = 0,
        name,
        onChange,
        onMouseDown,
        scale = Identity,
        step = 1,
        track = "normal",
        value: valueProp,
        ValueLabelComponent = ValueLabel,
        valueLabelDisplay = "off",
        valueLabelFormat = Identity,
        ...other
    } = props;
    const touchId = React.useRef();
    // We can't use the :active browser pseudo-classes.
    // - The active state isn't triggered when clicking on the rail.
    // - The active state isn't transfered when inversing a range slider.
    const [active, setActive] = React.useState(-1);
    const [open, setOpen] = React.useState(-1);

    const [valueDerived, setValueState] = useControlled({
        controlled: valueProp,
        default: defaultValue,
        name: "Slider",
    });

    const range = Array.isArray(valueDerived);
    let values = range ? valueDerived.slice().sort(asc) : [valueDerived];
    values = values.map((value: any) => clamp(value, min, max));
    const marks = (marksProp === true && step !== null
        ? [...Array(Math.floor((max - min) / step) + 1)].map((_, index) => ({
              value: min + step * index,
          }))
        : marksProp || []) as any[];

    const {
        isFocusVisible,
        onBlurVisible,
        ref: focusVisibleRef,
    } = useIsFocusVisible();
    const [focusVisible, setFocusVisible] = React.useState(-1);

    const sliderRef = React.useRef();
    const handleFocusRef = useForkRef(focusVisibleRef, sliderRef);
    const handleRef = useForkRef(ref, handleFocusRef);

    const handleFocus = useEventCallback((event: any) => {
        const index = Number(event.currentTarget.getAttribute("data-index"));
        if (isFocusVisible(event)) {
            setFocusVisible(index);
        }
        setOpen(index);
    });
    const handleBlur = useEventCallback(() => {
        if (focusVisible !== -1) {
            setFocusVisible(-1);
            onBlurVisible();
        }
        setOpen(-1);
    });
    const handleMouseOver = useEventCallback((event: any) => {
        const index = Number(event.currentTarget.getAttribute("data-index"));
        setOpen(index);
    });
    const handleMouseLeave = useEventCallback(() => {
        setOpen(-1);
    });

    const handleKeyDown = useEventCallback((event: any) => {
        const index = Number(event.currentTarget.getAttribute("data-index"));
        const value = values[index];
        const tenPercents = (max - min) / 10;
        const marksValues = (marks as any).map((mark: any) => mark.value);
        const marksIndex = marksValues.indexOf(value);
        let newValue;
        const increaseKey = "ArrowRight";
        const decreaseKey = "ArrowLeft";

        switch (event.key) {
            case "Home":
                newValue = min;
                break;
            case "End":
                newValue = max;
                break;
            case "PageUp":
                if (step) {
                    newValue = value + tenPercents;
                }
                break;
            case "PageDown":
                if (step) {
                    newValue = value - tenPercents;
                }
                break;
            case increaseKey:
            case "ArrowUp":
                if (step) {
                    newValue = value + step;
                } else {
                    newValue =
                        marksValues[marksIndex + 1] ||
                        marksValues[marksValues.length - 1];
                }
                break;
            case decreaseKey:
            case "ArrowDown":
                if (step) {
                    newValue = value - step;
                } else {
                    newValue = marksValues[marksIndex - 1] || marksValues[0];
                }
                break;
            default:
                return;
        }

        // Prevent scroll of the page
        event.preventDefault();

        if (step) {
            newValue = roundValueToStep(newValue, step, min);
        }

        newValue = clamp(newValue, min, max);

        if (range) {
            const previousValue = newValue;
            newValue = setValueIndex({
                values,
                source: valueDerived,
                newValue,
                index,
            }).sort(asc);
            focusThumb({
                sliderRef,
                activeIndex: newValue.indexOf(previousValue),
            });
        }

        setValueState(newValue);
        setFocusVisible(index);

        if (onChange) {
            onChange(event, newValue);
        }
    });

    const previousIndex = React.useRef();

    const getFingerNewValue = ({
        finger,
        move = false,
        values: values2,
        source,
    }: any) => {
        const { current: slider } = sliderRef;
        const { width, left } = (slider as any).getBoundingClientRect();

        let percent = (finger.x - left) / width;

        let newValue: any = percentToValue(percent, min, max);
        if (step) {
            newValue = roundValueToStep(newValue, step, min);
        } else {
            const marksValues = (marks as any).map((mark: any) => mark.value);
            const closestIndex = findClosest(marksValues, newValue);
            newValue = marksValues[closestIndex];
        }

        newValue = clamp(newValue, min, max);
        let activeIndex = 0;

        if (range) {
            if (!move) {
                activeIndex = findClosest(values2, newValue);
            } else {
                activeIndex = (previousIndex.current as unknown) as number;
            }

            const previousValue = newValue;
            newValue = setValueIndex({
                values: values2,
                source,
                newValue,
                index: activeIndex,
            }).sort(asc);
            activeIndex = newValue.indexOf(previousValue);
            previousIndex.current = (activeIndex as unknown) as any;
        }

        return { newValue, activeIndex };
    };

    const handleTouchMove = useEventCallback((event: any) => {
        const finger = trackFinger(event, touchId);

        if (!finger) {
            return;
        }

        const { newValue, activeIndex } = getFingerNewValue({
            finger,
            move: true,
            values,
            source: valueDerived,
        });

        focusThumb({ sliderRef, activeIndex, setActive });
        setValueState(newValue);

        if (onChange) {
            onChange(event, newValue);
        }
    });

    const handleTouchEnd = useEventCallback((event: any) => {
        const finger = trackFinger(event, touchId);

        if (!finger) {
            return;
        }

        const { newValue } = getFingerNewValue({
            finger,
            values,
            source: valueDerived,
        });

        setActive(-1);
        if (event.type === "touchend") {
            setOpen(-1);
        }

        touchId.current = undefined;

        const doc = document;
        doc.removeEventListener("mousemove", handleTouchMove);
        doc.removeEventListener("mouseup", handleTouchEnd);
        doc.removeEventListener("touchmove", handleTouchMove);
        doc.removeEventListener("touchend", handleTouchEnd);
    });

    const handleTouchStart = useEventCallback((event: any) => {
        // Workaround as Safari has partial support for touchAction: 'none'.
        event.preventDefault();
        const touch = event.changedTouches[0];
        if (touch != null) {
            // A number that uniquely identifies the current finger in the touch session.
            touchId.current = touch.identifier;
        }
        const finger = trackFinger(event, touchId);
        const { newValue, activeIndex } = getFingerNewValue({
            finger,
            values,
            source: valueDerived,
        });
        focusThumb({ sliderRef, activeIndex, setActive });

        setValueState(newValue);

        if (onChange) {
            onChange(event, newValue);
        }

        const doc = document;
        doc.addEventListener("touchmove", handleTouchMove);
        doc.addEventListener("touchend", handleTouchEnd);
    });

    React.useEffect(() => {
        const { current: slider } = sliderRef;
        (slider as any).addEventListener("touchstart", handleTouchStart);
        const doc = document;

        return () => {
            (slider as any).removeEventListener("touchstart", handleTouchStart);
            doc.removeEventListener("mousemove", handleTouchMove);
            doc.removeEventListener("mouseup", handleTouchEnd);
            doc.removeEventListener("touchmove", handleTouchMove);
            doc.removeEventListener("touchend", handleTouchEnd);
        };
    }, [handleTouchEnd, handleTouchMove, handleTouchStart]);

    const handleMouseDown = useEventCallback((event: any) => {
        if (onMouseDown) {
            onMouseDown(event);
        }

        event.preventDefault();
        const finger = trackFinger(event, touchId);
        const { newValue, activeIndex } = getFingerNewValue({
            finger,
            values,
            source: valueDerived,
        });
        focusThumb({ sliderRef, activeIndex, setActive });

        setValueState(newValue);

        if (onChange) {
            onChange(event, newValue);
        }

        const doc = document;
        doc.addEventListener("mousemove", handleTouchMove);
        doc.addEventListener("mouseup", handleTouchEnd);
    });

    const trackOffset = valueToPercent(range ? values[0] : min, min, max);
    const trackLeap =
        valueToPercent(values[values.length - 1], min, max) - trackOffset;
    const trackStyle = {
        ...axisProps.offset(trackOffset),
        ...axisProps.leap(trackLeap),
    };

    return (
        <span
            ref={handleRef}
            className={clsx(
                classes.root,
                {
                    [classes.disabled]: disabled,
                    [classes.marked]:
                        marks.length > 0 && marks.some((mark) => mark.label),
                },
                className
            )}
            onMouseDown={handleMouseDown}
            {...other}>
            <span className={classes.rail} />
            <span className={classes.track} style={trackStyle} />
            <input value={values.join(",")} name={name} type="hidden" />
            {marks.map((mark: any, index: number) => {
                const percent = valueToPercent(mark.value, min, max);
                const style = axisProps.offset(percent);

                let markActive =
                    (track === "normal" &&
                        (range
                            ? mark.value >= values[0] &&
                              mark.value <= values[values.length - 1]
                            : mark.value <= values[0])) ||
                    (track === "inverted" &&
                        (range
                            ? mark.value <= values[0] ||
                              mark.value >= values[values.length - 1]
                            : mark.value >= values[0]));

                return (
                    <React.Fragment key={mark.value}>
                        <span
                            style={style}
                            data-index={index}
                            className={clsx(classes.mark, {
                                [classes.markActive]: markActive,
                            })}
                        />
                        {mark.label != null ? (
                            <span
                                aria-hidden
                                data-index={index}
                                style={style}
                                className={clsx(classes.markLabel, {
                                    [classes.markLabelActive]: markActive,
                                })}>
                                {mark.label}
                            </span>
                        ) : null}
                    </React.Fragment>
                );
            })}
            {values.map((value: any, index: number) => {
                const percent = valueToPercent(value, min, max);
                const style = axisProps.offset(percent);

                return (
                    <ValueLabelComponent
                        key={index}
                        valueLabelFormat={valueLabelFormat}
                        valueLabelDisplay={valueLabelDisplay}
                        value={
                            typeof valueLabelFormat === "function"
                                ? valueLabelFormat(scale(value), index)
                                : valueLabelFormat
                        }
                        index={index}
                        open={
                            open === index ||
                            active === index ||
                            valueLabelDisplay === "on"
                        }
                        disabled={disabled}>
                        <span
                            className={classes.thumb}
                            tabIndex={disabled ? undefined : 0}
                            role="slider"
                            style={style}
                            data-index={index}
                            aria-label={ariaLabel}
                            aria-labelledby={ariaLabelledby}
                            aria-valuemax={scale(max)}
                            aria-valuemin={scale(min)}
                            aria-valuenow={scale(value)}
                            onKeyDown={handleKeyDown}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onMouseOver={handleMouseOver}
                            onMouseLeave={handleMouseLeave}
                        />
                    </ValueLabelComponent>
                );
            })}
        </span>
    );
});
