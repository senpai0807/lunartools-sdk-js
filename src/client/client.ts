import axios, { AxiosInstance } from "axios";
import {
    Config,
    Webhook,
    AddOrder,
    AddProduct,
    WebhookResponse
} from "../types/index";

export class Client {
    private clientId: string;
    private accessToken: string;
    private api: AxiosInstance;

    constructor(config: Config) {
        this.clientId = config.clientId;
        this.accessToken = config.accessToken;

        const baseUrl = config.baseUrl || 'https://www.lunartools.co';

        this.api = axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'X-Client-ID': this.clientId,
                'X-Access-Token': this.accessToken,
            },
        });
    }

    /**
     * Add a new product to inventory
     * @param product - Product details
     * @throws Error if required fields are missing or invalid
     */
    async addProduct(product: AddProduct): Promise<void> {
        this.validateAddProduct(product);

        await this.api.post('/sdk/add-order', {
            clientId: this.clientId,
            accessToken: this.accessToken,
            ...product
        });
    }

    /**
     * Add a new order
     * @param order - Order details
     * @throws Error if required fields are missing or invalid
     */
    async addOrder(order: AddOrder): Promise<void> {
        this.validateAddOrder(order);

        await this.api.post('/sdk/add-order', {
            clientId: this.clientId,
            accessToken: this.accessToken,
            ...order
        });
    }

    /**
     * Forward webhook payload to Discord
     * @param webhookUrl - Full webhook URL (e.g., https://www.lunartools.co/api/webhooks/{token})
     * @param payload - Discord webhook payload
     * @returns Response with status and queue length
     * @throws Error if payload is invalid
     */
    async webhook(webhookUrl: string, payload: Webhook): Promise<WebhookResponse> {
        this.validateWebhookPayload(payload);

        const response = await axios.post(webhookUrl, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    }

    private validateAddProduct(product: AddProduct): void {
        if (!product.name || product.name.trim() === '') {
            throw new Error('Product name is required');
        }

        if (!product.sku || product.sku.trim() === '') {
            throw new Error('Product SKU is required');
        }

        if (product.qty === undefined || product.qty === null) {
            throw new Error('Product quantity is required');
        }

        if (typeof product.qty !== 'number' || product.qty < 0) {
            throw new Error('Product quantity must be a non-negative number');
        }

        if (product.value !== undefined && (typeof product.value !== 'number' || product.value < 0)) {
            throw new Error('Product value must be a non-negative number');
        }

        if (product.spent !== undefined && (typeof product.spent !== 'number' || product.spent < 0)) {
            throw new Error('Product spent must be a non-negative number');
        }
    }

    private validateAddOrder(order: AddOrder): void {
        if (!order.name || order.name.trim() === '') {
            throw new Error('Order name is required');
        }

        if (!order.status || order.status.trim() === '') {
            throw new Error('Order status is required');
        }

        if (!order.orderNumber || order.orderNumber.trim() === '') {
            throw new Error('Order number is required');
        }
    }

    private validateWebhookPayload(payload: Webhook): void {
        if (!payload.content && (!payload.embeds || payload.embeds.length === 0)) {
            throw new Error('Webhook payload must contain either content or at least one embed');
        }

        if (payload.embeds && payload.embeds.length > 10) {
            throw new Error('Discord webhooks support a maximum of 10 embeds');
        }

        if (payload.embeds) {
            payload.embeds.forEach((embed, index) => {
                if (embed.fields && embed.fields.length > 25) {
                    throw new Error(`Embed ${index} exceeds the maximum of 25 fields`);
                }

                if (embed.fields) {
                    embed.fields.forEach((field, fieldIndex) => {
                        if (!field.name || field.name.trim() === '') {
                            throw new Error(`Embed ${index}, field ${fieldIndex}: name is required`);
                        }
                        if (!field.value || field.value.trim() === '') {
                            throw new Error(`Embed ${index}, field ${fieldIndex}: value is required`);
                        }
                    });
                }
            });
        }
    }
}