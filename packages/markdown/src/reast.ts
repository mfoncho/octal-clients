export default function reast(node: any): any {
    if (Array.isArray(node)) {
        return node.map(reast);
    } else if (Array.isArray(node.children)) {
        let children = node.children.map(reast).reduce((acc: any, val: any) => {
            if (acc.length == 0) {
                acc.push(val);
            } else {
                let last = acc[acc.length - 1];
                if (last.type !== val.type) {
                    acc.push(val);
                } else {
                    last.children = last.children.concat(val.children);
                }
            }
            return acc;
        }, []);
        return { ...node, children };
    } else {
        let known = ["bold", "strike", "italic"];
        let types = Object.keys(node).filter((key) => known.includes(key));
        if (types.length > 0) {
            let type = types.shift()!;
            node = { ...node };
            delete node[type];
            switch (type) {
                case "bold":
                    return { type: "strong", children: [reast(node)] };

                case "strike":
                    return { type: "strike", children: [reast(node)] };

                case "italic":
                    return { type: "emphasis", children: [reast(node)] };

                default:
                    break;
            }
        }
        return { type: "text", value: node.text };
    }
}
