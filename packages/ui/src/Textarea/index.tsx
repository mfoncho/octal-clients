import Input from "./Textarea";
import Mention from "./Mention";
import Post from "./Post";

export type Textarea = typeof Input & { Post: typeof Post, Mention: typeof Mention };

(Input as Textarea).Post = Post;
(Input as Textarea).Mention = Mention;

export default Input as Textarea;
