import Heading, { parse } from "./heading";

const hdepth = "####";

const title = "this is the title";

const sample = `${hdepth} ${title}
* Send a video file to multiple browser in real time for perfectly synchronized movie watching.`;

const levelone = `
${title}
============
level title type;
`;

const leveltwo = `
${title}
------------
level title type;
`;

test("Heading match", () => {
    const heading = new Heading();
    const match = heading.match(sample);
    expect(match).toBeTruthy();
    if (match) {
        expect(match[6]).toBe(title);
        expect(`${hdepth} ${title}\n`).toBe(
            sample.substring(0, match[0].length)
        );
    }
});

test("Parse level one heading", () => {
    const heading = new Heading();
    const match = heading.match(levelone);
    expect(match).toBeTruthy();
    if (match) {
        const [depth, substr] = parse(match);
        expect(depth).toBe(1);
        expect(substr).toBe(title);
    }
});

test("Parse level two heading", () => {
    const heading = new Heading();
    const match = heading.match(leveltwo);
    expect(match).toBeTruthy();
    if (match) {
        const [depth, substr] = parse(match);
        expect(depth).toBe(2);
        expect(substr).toBe(title);
    }
});
