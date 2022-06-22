import { RiMailSendFill as Send } from "react-icons/ri";
import {
    MdOutlineEmail as Mail,
    MdOutlineMarkEmailRead as Sent,
} from "react-icons/md";

type Mail = typeof Mail & {
    Send: typeof Send;
    Sent: typeof Sent;
};

(Mail as Mail).Send = Send;
(Mail as Mail).Sent = Sent;

export default Mail as Mail;
