import { BsInfoCircle, BsInfoCircleFill } from "react-icons/bs";

type Info = typeof BsInfoCircle & { Solid: typeof BsInfoCircle };

const Info = BsInfoCircle;

(Info as Info).Solid = BsInfoCircleFill;

export default Info as Info;
