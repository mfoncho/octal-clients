import Textarea from "./Textarea";
import Mention from "./Mention";
import Post from "./Post";
import Input from "./Input";

export type TextAreaType = typeof Textarea & {
    Post: typeof Post;
    Input: typeof Input;
    Mention: typeof Mention;
};

(Textarea as TextAreaType).Post = Post;
(Textarea as TextAreaType).Input = Input;
(Textarea as TextAreaType).Mention = Mention;

export default Textarea as TextAreaType;
