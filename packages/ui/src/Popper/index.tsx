import React, { useState, useEffect, useImperativeHandle } from "react";
import Flow from "../Flow";
import Transition from "@material-ui/core/Fade";
import Portal from "./Portal";
import { usePopper } from "react-popper";

export interface Openable {
    open: boolean;
}

export interface Anchored<T = any> {
    anchorEl?: HTMLElement | null;
    onClickAway?: (e: React.MouseEvent | MouseEvent) => void;
    onHoverAway?: (e: React.MouseEvent | MouseEvent) => void;
}

export type PlacementType =
    | "top"
    | "bottom"
    | "right"
    | "left"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "right-start"
    | "right-end"
    | "left-start"
    | "left-end";

export type FlipOptionsType = {
    flipVariations?: boolean;
    allowedPlacements?: PlacementType[];
};

export interface IBasePopper<S, T> extends React.HTMLAttributes<T> {
    placement?: PlacementType;
    as?: S;
    open?: boolean;
    anchorEl?: HTMLElement | null;
    arrow?: boolean;
    distance?: number;
    portal?: boolean;
    flip?: FlipOptionsType;
    skidding?: number;
    strategy?: "fixed" | "absolute";
    arrowClassName?: string;
    transitionDuration?: {
        enter?: number;
        exit?: number;
    };
    onHoverAway?: (e: MouseEvent) => void;
    onClickAway?: (e: MouseEvent) => void;
    TransitionProps?: any;
    TransitionComponent?: React.ComponentType<any>;
}

export type IPopper =
    | IBasePopper<"div", HTMLDivElement>
    | IBasePopper<"span", HTMLSpanElement>
    | IBasePopper<"ul", HTMLUListElement>
    | IBasePopper<"ol", HTMLOListElement>;

const defaultTransitionDuration = {
    enter: 105,
    exit: 105,
};

const Popper = React.forwardRef<HTMLElement, IPopper>((props, ref) => {
    const [hovered, setHovered] = useState<boolean>(false);
    const [arrowEl, setArrowEl] = useState<HTMLElement | null>(null);
    const [popperEl, setPopperEl] = useState<HTMLElement | null>(null);

    const {
        anchorEl,
        children = null,
        arrow = false,
        portal = false,
        distance,
        open = true,
        as: asComponent = "div",
        skidding,
        onHoverAway,
        arrowClassName = "",
        placement,
        flip,
        onBlur,
        strategy,
        className = "",
        tabIndex,
        transitionDuration = defaultTransitionDuration,
        TransitionProps,
        onClickAway,
        TransitionComponent = Transition,
        style: rootStyle = {},
        ...rootProps
    } = props;

    useEffect(() => {
        if (popperEl && popperEl.focus) {
            popperEl.focus({ preventScroll: true });
        }
    }, [popperEl]);

    useImperativeHandle(ref, () => popperEl as HTMLElement, [popperEl]);

    let modifiers: any[] = [];

    if (distance || skidding) {
        let modifier = {
            name: "offset",
            options: {
                offset: [skidding ?? 0, distance ?? 0],
            },
        };
        modifiers.push(modifier);
    }

    if (flip) {
        let modifier = {
            name: "flip",
            options: flip,
        };
        modifiers.push(modifier);
    }

    if (arrow) {
        let modifier = { name: "arrow", options: { element: arrowEl } };
        modifiers.push(modifier);
    }

    const { styles, attributes } = usePopper(anchorEl, popperEl, {
        placement: placement,
        modifiers: modifiers,
        strategy: strategy,
    });

    useEffect(() => {
        if (popperEl) {
            window.addEventListener("click", handleClickAway as any, true);
            return () => {
                window.removeEventListener(
                    "click",
                    handleClickAway as any,
                    true
                );
            };
        }
    }, [popperEl]);

    useEffect(() => {
        if (popperEl && onHoverAway) {
            window.addEventListener("mouseout", handleMouseOut as any, true);
            popperEl.addEventListener(
                "mouseover",
                handleMouseOver as any,
                true
            );
            return () => {
                window.removeEventListener(
                    "mouseout",
                    handleMouseOut as any,
                    true
                );
                popperEl.removeEventListener(
                    "mouseover",
                    handleMouseOver as any,
                    true
                );
            };
        }
    }, [popperEl, onHoverAway, hovered]);

    function handleMouseOver() {
        if (!hovered) {
            setHovered(true);
        }
    }

    function handleMouseOut(e: MouseEvent) {
        if (onHoverAway && hovered) {
            let node = e.target as (Node & ParentNode) | null;
            while (node && node != popperEl) {
                node = node.parentNode;
            }
            if (!node || node != popperEl) {
                onHoverAway(e as any);
            }
        }
    }

    function handleClickAway(e: MouseEvent) {
        if (onClickAway) {
            let node = e.target as (Node & ParentNode) | null;
            while (node && node != popperEl) {
                node = node.parentNode;
            }
            if (!node || node != popperEl) {
                onClickAway(e as any);
            }
        }
    }

    function createElement() {
        return React.createElement(
            asComponent,
            {
                ...rootProps,
                ref: setPopperEl,
                style: { ...rootStyle, ...styles.popper },
                className: className + " popper",
                ...attributes.popper,
            } as any,
            [
                <React.Fragment key="children">{children}</React.Fragment>,
                arrow && (
                    <div
                        key="popper-arrow"
                        className={arrowClassName + " popper-arrow"}
                        ref={setArrowEl}
                        style={styles.arrow}
                        data-popper-arrow
                    />
                ),
            ]
        );
    }

    return (
        <TransitionComponent
            in={open}
            appear={true}
            timeout={transitionDuration}
            role="none presentation"
            {...TransitionProps}>
            {portal ? <Portal>{createElement()}</Portal> : createElement()}
        </TransitionComponent>
    );
});

function create<T, TProps>(
    PopperComponent: React.ComponentType<TProps & Openable & Anchored<T>>,
    unMountTimeout = defaultTransitionDuration.exit
) {
    return React.forwardRef<T, TProps & Openable & Anchored<T>>(
        (props, ref) => {
            return (
                <Flow.Switch value={props.open} unMountTimeout={unMountTimeout}>
                    <Flow.Case value={true}>
                        <PopperComponent {...props} ref={ref} />
                    </Flow.Case>
                </Flow.Switch>
            );
        }
    );
}

type PopperType = typeof Popper & {
    create: typeof create;
};

(Popper as PopperType).create = create;

export default Popper as PopperType;
