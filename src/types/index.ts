export interface Config {
    clientId: string;
    accessToken: string;
    baseUrl?: string;
}

export interface Thumbnail {
    url?: string;
}

export interface Image {
    url?: string;
}

export interface Footer {
    text?: string;
    iconUrl?: string;
}

export interface Author {
    name?: string;
    url?: string;
    iconUrl?: string;
}

export interface Field {
    name: string;
    value: string;
    inline?: boolean;
}

export interface Embed {
    author?: Author;
    title?: string;
    url?: string;
    description?: string;
    color?: number;
    fields?: Field[];
    thumbnail?: Thumbnail;
    image?: Image;
    footer?: Footer;
    timestamp?: string;
}

export interface Webhook {
    username?: string;
    avatarUrl?: string;
    content?: string;
    embeds?: Embed[];
}

export interface WebhookResponse {
    status: string;
    queueLength: number;
}

export interface AddProduct {
    name: string;
    sku: string;
    qty: number;
    size?: string;
    store?: string;
    value?: number;
    spent?: number;
}

export interface AddOrder {
    name: string;
    status: string;
    orderNumber: string;
    image?: string;
    tracking?: string;
    date?: string;
    qty?: string;
    price?: string;
    orderTotal?: string;
    account?: string;
    retailer?: string;
    tags?: string;
}