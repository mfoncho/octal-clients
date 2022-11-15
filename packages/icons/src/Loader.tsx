import { BiLoaderCircle as CircularDots } from "react-icons/bi";
import { BiLoaderAlt as CrescentSolid } from "react-icons/bi";
import { BiLoader as Fan } from "react-icons/bi";

type Loader = typeof Fan & {
    Crescent: typeof CrescentSolid;
    Dots: typeof CircularDots;
};

(Fan as Loader).Crescent = CrescentSolid;
(Fan as Loader).Dots = CircularDots;

export default Fan as Loader;
