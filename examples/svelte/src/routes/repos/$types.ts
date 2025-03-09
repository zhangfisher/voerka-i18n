

export type Repo = {
    title: string;
    author: string;
    name: string;
    url: string;
    description: string;
    topics?: string[];
    focus?: boolean;
    notes?: string;
};
