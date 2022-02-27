import { match } from "./paragraph";

const sample = `Now go build something awesome! Here are some **ideas** to get your creative juices flowing:
* Send a video file to multiple browser in real time for perfectly synchronized movie watching.`;

test("Paragraph match", () => {
    const matched = match(sample);
    expect(matched).toBeTruthy();
    if (matched) {
        const length = matched[0].length;
        expect(length).toBeGreaterThan(1);
        expect(sample.split("\n")[0] + "\n").toBe(sample.substring(0, length));
    }
});
