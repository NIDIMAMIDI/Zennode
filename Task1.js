const readline = require('readline');

class Catalogue {

    // Here the Constructor intializes the product and price of that product
    
    constructor() {
        this.products = {
            "Product A": 20,
            "Product B": 40,
            "Product C": 50
        };
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    calculateDiscount(cart, quantities) {

        // total number of quantities that are available

        const totalQuantity = Object.values(quantities).reduce((acc, val) => acc + val, 0);
        
        // total cost of the quantities in the cart

        const totalPrice = Object.keys(cart).reduce((acc, key) => acc + cart[key], 0);
        let discountAmount = 0;

        // Discount Rules

        // If cart total exceeds $200, then we will apply a flat $10 discount on the cart total

        if (totalPrice > 200) {
            discountAmount = Math.min(10, totalPrice);
            return ["flat_10_discount", discountAmount];
        }

    

        for (const product in quantities) {

            // If the quantity of any single product exceeds 10 units, apply a 5% discount on that item's total price.
            

            if (quantities[product] > 10) {
                discountAmount = Math.min(0.05 * quantities[product] * this.products[product], cart[product]);
                return ["bulk_5_discount", discountAmount];
            }
        }

        // If total quantity exceeds 20 units, apply a 10% discount on the cart total.

        if (totalQuantity > 20) {
            discountAmount = Math.min(0.1 * totalPrice, totalPrice);
            return ["bulk_10_discount", discountAmount];
        }

        // If total quantity exceeds 30 units & any single product quantity greater than 15, then apply a 50% discount on products which are above  15 quantity. The first 15 quantities have the original price and units above 15 will get a 50% discount.


        if (totalQuantity > 30 && Object.values(quantities).some(quantity => quantity > 15)) {
            const discountedUnits = Object.values(quantities).reduce((acc, val) => acc + Math.max(0, val - 15), 0);
            discountAmount = Math.min(0.5 * discountedUnits * this.products[product], totalPrice);
            return ["tiered_50_discount", discountAmount];
        }

        return [null, 0];
    }

    // calculating gift wrap fee and shipping fee 

    calculateFees(quantities) {

        const quantitiesAsNumbers = Object.values(quantities).map(Number);
    
        const giftWrapFee = quantitiesAsNumbers.reduce((acc, val) => acc + val, 0);
        const shippingFee = Math.floor(quantitiesAsNumbers.reduce((acc, val) => acc + val, 0) / 10) * 5;
    
        return [giftWrapFee, shippingFee];

    }

    async checkout() {
        const cart = {};
        const quantities = {};

        //  # Taking quantity of product as input and is it wrapped or not. 

        for (const product in this.products) {
            const quantity = await this.question(`Enter quantity for ${product}: `);
            const wrappedAsGift = (await this.question(`Is ${product} wrapped as a gift? (yes/no): `)).toLowerCase() === 'yes';

            cart[product] = Number(quantity) * this.products[product];
            if (wrappedAsGift) {
                cart[product] += Number(quantity);
            }
            quantities[product] = Number(quantity);
        }

     // Calculate Subtotal
    const subtotal = Object.keys(cart).reduce((acc, key) => acc + Number(cart[key]), 0);

    // Calculate Discounts
    const [discountName, discountAmount] = this.calculateDiscount(cart, quantities);

    // Calculate giftWrapFees and shippingFee
    const [giftWrapFee, shippingFee] = this.calculateFees(quantities);

    // Convert quantities to numbers
    const quantitiesAsNumbers = Object.keys(quantities).reduce((acc, key) => {
        acc[key] = Number(quantities[key]);
        return acc;
    }, {});

    // Calculate Total
    const total = (subtotal - discountAmount) + giftWrapFee + shippingFee;

    // printing product details and quantity of each product.

    for (const product in this.products) {
        console.log(`${product} - Quantity: ${quantitiesAsNumbers[product]}, Total: $${cart[product]}`);
    }

    // Printing Subtotal

    console.log(`\nSubtotal: $${subtotal}`);

    // If any discounts are applicable then printing those Discounts

    if (discountName) {
        console.log(`Discount Applied - ${discountName}: $${discountAmount}`);
    }

    // Printing Gift Wrap Fees, Shipping Fees and Total

    console.log(`\nGift Wrap Fee: $${giftWrapFee}`);
    console.log(`Shipping Fee: $${shippingFee}`);

    console.log(`\nTotal: $${total}`);

    this.rl.close();
    }

    question(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, (answer) => {
                resolve(answer);
            });
        });
    }
}

// Run the checkout
const catalogue = new Catalogue();
catalogue.checkout();
