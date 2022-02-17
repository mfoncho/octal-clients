import List, { parse } from "./list";

const list = new List();

const sample2 = `1. one
2)   two
4)   three`;

const sample = `*   Red
*   Green
*   Blue
-   [x] Red
-   [ ] Green
-   Blue
${sample2}`;

test("Parse heading", () => {
    let match = list.match(sample);
    expect(match).toBeTruthy();
    if (match) {
        const [ordered, items] = parse(match[1] ?? match[4] ?? match[0]);
        expect(ordered).toBe(false);
        expect(items.length).toBe(6);
        expect(items[3].checked).toBe(true);
        expect(items[4].checked).toBe(false);
    }
});

test("Parse heading", () => {
    const [ordered, items] = parse(sample2);
    expect(ordered).toBe(true);
    expect(items.length).toBe(3);
});
