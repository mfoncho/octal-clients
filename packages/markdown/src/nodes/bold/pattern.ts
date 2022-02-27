export const star = "\\*\\*([\\S](.)+?[\\S])\\*\\*(?=[^\\*]|$)";
export const underscore = "__([\\S](.)+?[\\S])__(?=[^_]|$)";
export default `(${star})|(${underscore})`;
