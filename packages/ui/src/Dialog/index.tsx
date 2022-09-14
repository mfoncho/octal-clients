import React from "react";
import clx from "classnames";
import BaseDialog from "./Base";
import Warning from "./Warning";
import { useDialog } from "./hooks";
import * as Icons from "@octal/icons";
import Effect from "@material-ui/core/Zoom";
import Flow from "../Flow";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import { useScreen } from "../hooks";
export { useDialog } from "./hooks";

export interface Openable {
    open: boolean;
}

export interface Closeable {
    onClose: (e: any, reason?: string) => void;
}

export interface IDialog {
    icon?: JSX.Element;
    open?: boolean;
    title: string | JSX.Element;
    fullHeight?: boolean;
    fullScreen?: boolean;
    fullWidth?: boolean;
    children?: any;
    actions?: JSX.Element;
    maxWidth?: "sm" | "md" | "xs" | "lg" | "xl";
    onClose?: (e: any, reason: string) => void;
}

export interface IBaseDialog {
    open?: boolean;
    fullScreen?: boolean | "desktop" | "tablet" | "mobile";
    fullWidth?: boolean;
    TransitionComponent?: any;
    className?: string;
    children?: any;
    actions?: JSX.Element;
    maxWidth?: "sm" | "md" | "xs" | "lg" | "xl";
    onClose?: (e: any, reason: string) => void;
    onExited?: () => void;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps,
    ref
) {
    return <Effect ref={ref} {...props} />;
});

export const Actions = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
    const { children, className } = props;
    return (
        <div
            ref={ref}
            className={clx(
                className,
                "flex flex-row items-center justify-end px-6 py-4 bg-gray-100"
            )}>
            {children}
        </div>
    );
});

export const Content = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return <div ref={ref} className={clx(className, "px-6 py-2")} {...props} />;
});

export const Base = React.forwardRef<HTMLElement, IBaseDialog>(
    (
        { open = true, maxWidth = "sm", fullWidth = true, className, ...props },
        ref
    ) => {
        const screen = useScreen();

        return (
            <BaseDialog
                open={open}
                scroll="paper"
                fullScreen={
                    (typeof props.fullScreen === "boolean" &&
                        props.fullScreen) ||
                    (typeof props.fullScreen === "string" &&
                        screen[props.fullScreen])
                }
                maxWidth={maxWidth}
                onExited={props.onExited}
                className={className}
                PaperProps={{ ref: ref }}
                fullWidth={fullWidth}
                onClose={props.onClose}
                TransitionComponent={props.TransitionComponent ?? Transition}>
                {props.children}
            </BaseDialog>
        );
    }
);

export const Dialog = React.forwardRef<HTMLDivElement, IDialog>(
    (
        {
            open = true,
            maxWidth = "sm",
            fullHeight,
            fullWidth = true,
            ...props
        },
        ref
    ) => {
        const screen = useScreen();

        function handleClose(event: React.MouseEvent) {
            if (props.onClose) {
                props.onClose(event, "closed");
            }
        }

        return (
            <Base
                open={open}
                fullScreen={
                    props.fullScreen === undefined
                        ? screen.mobile
                        : props.fullScreen
                }
                maxWidth={maxWidth}
                className={clx(
                    "flex flex-col overflow-hidden",
                    fullHeight && "h-5/6"
                )}
                fullWidth={fullWidth}
                ref={ref}
                onClose={props.onClose}>
                <div className="flex max-w-full flex-none flex-row h-20 px-6 items-center justify-between">
                    {typeof props.title === "string" ? (
                        <span className="font-extrabold text-xl text-gray-800">
                            {props.title}
                        </span>
                    ) : (
                        props.title
                    )}
                    {props.onClose && (
                        <button
                            className="ml-2 rounded-md hover:bg-gray-200 w-8 h-8 flex justify-center items-center"
                            onClick={handleClose}>
                            <Icons.Close />
                        </button>
                    )}
                </div>
                <div className="flex flex-col flex-1 justify-between">
                    {props.children}
                </div>
            </Base>
        );
    }
);

function create<TProps>(
    DialogComponent: React.ComponentType<TProps & Openable & Closeable>
) {
    return React.forwardRef<HTMLDivElement, TProps & Openable & Closeable>(
        (props, ref) => {
            return (
                <Flow.Switch value={props.open} unMountTimeout={200}>
                    <Flow.Case value={true}>
                        <DialogComponent {...props} ref={ref} />
                    </Flow.Case>
                </Flow.Switch>
            );
        }
    );
}

type DialogType = typeof Dialog & {
    Base: typeof Base;
    Actions: typeof Actions;
    Content: typeof Content;
    Warning: typeof Warning;
    create: typeof create;
    useDialog: typeof useDialog;
};

(Dialog as DialogType).Base = Base;
(Dialog as DialogType).Warning = Warning;
(Dialog as DialogType).Actions = Actions;
(Dialog as DialogType).Content = Content;
(Dialog as DialogType).create = create;
(Dialog as DialogType).useDialog = useDialog;

export default Dialog as DialogType;
