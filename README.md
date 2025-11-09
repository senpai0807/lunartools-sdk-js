# Lunar Tools SDK

Official TypeScript/JavaScript SDK for the Lunar Tools API.

## Installation
```bash
npm install @lunartools/sdk
```

## Usage
```typescript
import { Client } from '@lunartools/sdk';

// Initialize with your client credentials
const client = new Client({
    clientId: 'your-client-id',
    accessToken: 'your-access-token'
});

// Add product to inventory
await client.addProduct({
    name: 'Charizard VMAX',
    sku: 'SWSH-074',
    qty: 5,
    value: 150.00,
    spent: 120.00,
    size: 'Standard',
    store: 'TCGPlayer'
});

await client.addOrder({
    name: 'Pokemon Booster Box',
    status: 'shipped',
    orderNumber: 'ORD-12345',
    price: '120.00',
    orderTotal: '132.00',
    retailer: 'Amazon',
    tracking: '1Z999AA10123456784'
});

// Forward webhook to Discord
const response = await client.webhook('https://www.lunartools.co/api/webhooks/YOUR_TOKEN_HERE',
    {
        content: 'New product in stock!',
        embeds: [{
            title: 'Product Alert',
            description: 'Charizard VMAX is now available',
            color: 0x5865F2,
            fields: [
                { name: 'Price', value: '$150.00', inline: true },
                { name: 'Quantity', value: '5', inline: true }
            ],
            timestamp: new Date().toISOString()
        }]
    }
);

console.log(response); // { status: 'queued', queueLength: 1 }
```

## API Reference

### Constructor
```typescript
new Client(config: Config)
```

**Config:**
- `clientId` (string, required) - Your client ID from Lunar Tools
- `accessToken` (string, required) - Your access token from Lunar Tools
- `baseUrl` (string, optional) - Custom API base URL (defaults to https://www.lunartools.co)

### Methods

#### `addProduct(product: AddProduct): Promise<void>`

Add a new product to inventory.

**Required fields:**
- `name` (string) - Product name
- `sku` (string) - Product SKU
- `qty` (number) - Quantity

**Optional fields:**
- `size` (string) - Product size
- `store` (string) - Store name
- `value` (number) - Product value
- `spent` (number) - Amount spent

**Example:**
```typescript
    await client.addProduct({
        name: 'Product Name',
        sku: 'SKU-123',
        qty: 10,
        value: 50.00
    });
```

#### `addOrder(order: AddOrder): Promise<void>`

Add a new order.

**Required fields:**
- `name` (string) - Order name
- `status` (string) - Order status
- `orderNumber` (string) - Order number

**Optional fields:**
- `image` (string) - Product image URL
- `tracking` (string) - Tracking number
- `date` (string) - Order date
- `qty` (string) - Quantity
- `price` (string) - Item price
- `orderTotal` (string) - Total order amount
- `account` (string) - Account name
- `retailer` (string) - Retailer name
- `tags` (string) - Order tags

**Example:**
```typescript
    await client.addOrder({
        name: 'Pokemon Cards',
        status: 'delivered',
        orderNumber: 'ORD-456',
        price: '99.99',
        retailer: 'eBay'
    });
```

#### `forwardWebhook(webhookUrl: string, payload: DiscordWebhookPayload): Promise<WebhookResponse>`

Forward a webhook payload to Discord.

**Parameters:**
- `webhookUrl` (string) - Full Lunar Tools webhook URL
- `payload` (DiscordWebhookPayload) - Discord webhook payload

**Payload structure:**
- `content` (string, optional) - Message content
- `username` (string, optional) - Override webhook username
- `avatarUrl` (string, optional) - Override webhook avatar
- `embeds` (Embed[], optional) - Array of embeds (max 10)

**Example:**
```typescript
    const response = await client.webhook('https://www.lunartools.co/api/webhooks/TOKEN',
        {
            content: 'Hello!',
            embeds: [{
                title: 'Alert',
                description: 'Something happened',
                color: 0xFF0000,
                fields: [
                    { name: 'Field 1', value: 'Value 1', inline: true }
                ]
            }]
        }
    );
```

## Error Handling

The SDK validates all inputs and throws descriptive errors:
```typescript
    try {
        await client.addProduct({
            name: '',
            sku: 'SKU-123',
            qty: 5
        });
    } catch (error) {
        console.error(error.message);
    }
```

## License

MIT