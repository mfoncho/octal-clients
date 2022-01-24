import React from "react";
import clsx from "classnames";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Zoom from "@material-ui/core/Zoom";
import { makeStyles } from "@material-ui/core/styles";

function capitalize(word: string): string {
    return `${word[0].toUpperCase()}${word.substring(1)}`;
}

export const useStyles = makeStyles((theme: any) => ({
    /* Styles applied to the root element. */
    root: {
        "@media print": {
            // Use !important to override the Modal inline-style.
            position: "absolute !important",
        },
    },
    /* Styles applied to the container element if `scroll="paper"`. */
    scrollPaper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    /* Styles applied to the container element if `scroll="body"`. */
    scrollBody: {
        overflowY: "auto",
        overflowX: "hidden",
        textAlign: "center",
        "&:after": {
            content: '""',
            display: "inline-block",
            verticalAlign: "middle",
            height: "100%",
            width: "0",
        },
    },
    /* Styles applied to the container element. */
    container: {
        height: "100%",
        "@media print": {
            height: "auto",
        },
        // We disable the focus ring for mouse, touch and keyboard users.
        outline: 0,
    },
    /* Styles applied to the `Paper` component. */
    paper: {
        margin: 32,
        borderRadius: 10,
        position: "relative",
        "@media print": {
            overflowY: "visible",
            boxShadow: "none",
        },
    },
    /* Styles applied to the `Paper` component if `scroll="paper"`. */
    paperScrollPaper: {
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100% - 64px)",
    },
    /* Styles applied to the `Paper` component if `scroll="body"`. */
    paperScrollBody: {
        display: "inline-block",
        verticalAlign: "middle",
        textAlign: "left", // 'initial' doesn't work on IE 11
    },
    /* Styles applied to the `Paper` component if `maxWidth=false`. */
    paperWidthFalse: {
        maxWidth: "calc(100% - 64px)",
    },
    /* Styles applied to the `Paper` component if `maxWidth="xs"`. */
    paperWidthXs: {
        maxWidth: Math.max(theme.breakpoints.values.xs, 444),
        "&$paperScrollBody": {
            [theme.breakpoints.down(
                Math.max(theme.breakpoints.values.xs, 444) + 32 * 2
            )]: {
                maxWidth: "calc(100% - 64px)",
            },
        },
    },
    /* Styles applied to the `Paper` component if `maxWidth="sm"`. */
    paperWidthSm: {
        maxWidth: theme.breakpoints.values.sm,
        "&$paperScrollBody": {
            [theme.breakpoints.down(theme.breakpoints.values.sm + 32 * 2)]: {
                maxWidth: "calc(100% - 64px)",
            },
        },
    },
    /* Styles applied to the `Paper` component if `maxWidth="md"`. */
    paperWidthMd: {
        maxWidth: theme.breakpoints.values.md,
        "&$paperScrollBody": {
            [theme.breakpoints.down(theme.breakpoints.values.md + 32 * 2)]: {
                maxWidth: "calc(100% - 64px)",
            },
        },
    },
    /* Styles applied to the `Paper` component if `maxWidth="lg"`. */
    paperWidthLg: {
        maxWidth: theme.breakpoints.values.lg,
        "&$paperScrollBody": {
            [theme.breakpoints.down(theme.breakpoints.values.lg + 32 * 2)]: {
                maxWidth: "calc(100% - 64px)",
            },
        },
    },
    /* Styles applied to the `Paper` component if `maxWidth="xl"`. */
    paperWidthXl: {
        maxWidth: theme.breakpoints.values.xl,
        "&$paperScrollBody": {
            [theme.breakpoints.down(theme.breakpoints.values.xl + 32 * 2)]: {
                maxWidth: "calc(100% - 64px)",
            },
        },
    },
    /* Styles applied to the `Paper` component if `fullWidth={true}`. */
    paperFullWidth: {
        width: "calc(100% - 64px)",
    },
    /* Styles applied to the `Paper` component if `fullScreen={true}`. */
    paperFullScreen: {
        margin: 0,
        width: "100%",
        maxWidth: "100%",
        height: "100%",
        maxHeight: "none",
        borderRadius: 0,
        "&$paperScrollBody": {
            margin: 0,
            maxWidth: "100%",
        },
    },
}));

const defaultTransitionDuration = {
    enter: 225,
    exit: 195,
};
/**
 * Dialogs are overlaid modal paper based components with a backdrop.
 */
export default React.forwardRef<any, any>(function Dialog(props, ref) {
    const classes = useStyles();
    const {
        BackdropProps,
        children,
        className,
        disableBackdropClick = false,
        disableEscapeKeyDown = false,
        fullScreen = false,
        fullWidth = false,
        maxWidth = "sm",
        onBackdropClick,
        onClose,
        onEnter,
        onEntered,
        onEntering,
        onEscapeKeyDown,
        onExit,
        onExited,
        PaperProps,
        onExiting,
        open,
        scroll = "paper",
        TransitionComponent = Zoom,
        transitionDuration = defaultTransitionDuration,
        TransitionProps,
        "aria-describedby": ariaDescribedby,
        "aria-labelledby": ariaLabelledby,
        ...other
    } = props;

    const mouseDownTarget = React.useRef<any>();
    const handleMouseDown = (event: React.MouseEvent) => {
        mouseDownTarget.current = event.target;
    };
    const handleBackdropClick = (event: React.MouseEvent) => {
        // Ignore the events not coming from the "backdrop"
        // We don't want to close the dialog when clicking the dialog content.
        if (event.target !== event.currentTarget) {
            return;
        }

        // Make sure the event starts and ends on the same DOM element.
        if (event.target !== mouseDownTarget.current) {
            return;
        }

        mouseDownTarget.current = null;

        if (onBackdropClick) {
            onBackdropClick(event);
        }

        if (!disableBackdropClick && onClose) {
            onClose(event, "backdropClick");
        }
    };

    return (
        <Modal
            className={clsx(classes.root)}
            BackdropComponent={Backdrop}
            BackdropProps={{
                transitionDuration,
                ...BackdropProps,
            }}
            closeAfterTransition
            {...(disableBackdropClick
                ? {
                      disableBackdropClick,
                  }
                : {})}
            disableEscapeKeyDown={disableEscapeKeyDown}
            onClose={onClose}
            open={open}
            ref={ref}
            {...other}>
            <TransitionComponent
                appear
                in={open}
                timeout={transitionDuration}
                onEnter={onEnter}
                onEntering={onEntering}
                onEntered={onEntered}
                onExit={onExit}
                onExiting={onExiting}
                onExited={onExited}
                role="none presentation"
                {...TransitionProps}>
                {/* roles are applied via cloneElement from TransitionComponent */}
                {/* roles needs to be applied on the immediate child of Modal or it'll inject one */}
                <div
                    className={clsx(
                        classes.container,
                        classes[
                            `scroll${capitalize(
                                scroll
                            )}` as keyof typeof classes
                        ]
                    )}
                    onMouseUp={handleBackdropClick}
                    onMouseDown={handleMouseDown}>
                    <div
                        role="dialog"
                        aria-describedby={ariaDescribedby}
                        aria-labelledby={ariaLabelledby}
                        className={clsx(
                            className,
                            "bg-white shadow-lg",
                            classes.paper,
                            classes[
                                `paperScroll${capitalize(
                                    scroll
                                )}` as keyof typeof classes
                            ],
                            classes[
                                `paperWidth${capitalize(
                                    String(maxWidth)
                                )}` as keyof typeof classes
                            ],
                            {
                                [classes.paperFullScreen]: fullScreen,
                                [classes.paperFullWidth]: fullWidth,
                            }
                        )}>
                        {children}
                    </div>
                </div>
            </TransitionComponent>
        </Modal>
    );
});
