export const url =
    "(([a-zA-Z]+:\\/\\/)((\\d{1,3}.\\d{1,3}.\\d{1,3}.\\d{1,3}:\\d{1,5})|(([a-zA-Z0-9\\.]+)\\.[a-zA-Z]+))(\\/\\S{0,})?)";
export const link = "((?<!\\!)\\[((\\w)([\\w\\s])+\\w)\\]\\((.*)\\))";
export default `${link}|${url}`;
