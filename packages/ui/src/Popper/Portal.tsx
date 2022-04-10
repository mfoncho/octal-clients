import ReactDOM from "react-dom";

export default function Portal({ children }: any) {
    return typeof document === "object"
        ? ReactDOM.createPortal(children, document.body)
        : null;
}
