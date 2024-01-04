export const isUrl = (url: string) => {
    const urlRegex = new RegExp(
        "^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$",
    );
    return urlRegex.test(url);
};

export const createDOM = <T extends keyof HTMLElementTagNameMap>(
    tag: T,
    className: string,
    textContent?: string,
) => {
    const dom = document.createElement<T>(tag);
    dom.classList.add(`doto-${className}`);
    if (textContent) dom.textContent = textContent;
    return dom;
};

export interface LinkResult {
    meta: Meta;
    links: Link[];
    rel: [];
}

export interface Link {
    href: string;
    rel: string[];
    type: string;
}

export interface Meta {
    description: string;
    title: string;
    author: string;
    canonical: string;
}
