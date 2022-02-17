export const depth = "([#]{1,6}) (.*)";
export const level = "(([^#\\s])([\\w\\s])+)\n((([=]){6,})|(([-]){6,}))";
export default `((^)|(?<=\n))((${depth})|(${level}))\n?`;
