export type Post = {
    id: number;
    title: string;
    author: string;
};

export type PostsResponse = { items: Post[] };
