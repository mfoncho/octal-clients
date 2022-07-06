export const path =
    /(([a-zA-Z]+:\/\/)?(((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?)|(([a-zA-Z0-9]+\.)?(\w+\.[a-zA-Z]+)))(\/\S+)?)/
        .toString()
        .replace(/^\//, "")
        .replace(/.$/, "");

export const link = /((?<!\!)\[((\w)([\w\s])+\w)\]\((.*)\))/
    .toString()
    .replace(/^\//, "")
    .replace(/.$/, "");

export default `${link}|${path}`;
