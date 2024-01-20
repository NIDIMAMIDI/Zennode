class Catalogue:
    # Here the Constructor intializes the product and price of that product
    def __init__(self):
        self.products = {
            "Product A": 20,
            "Product B": 40,
            "Product C": 50
        }

    def calculate_discount(self, cart, quantities):
        total_quantity = sum(quantities.values())   # total number of quantities that are available
        total_price = sum(cart.values()) # total cost of the quantities in the cart
        discount_amount = 0

        # Discount Rules

        #  If cart total exceeds $200, then we will apply a flat $10 discount on the cart total
        
        if total_price > 200:
            discount_amount = min(10, total_price)
            return "flat_10_discount", discount_amount

        for product, quantity in quantities.items():

            #  If the quantity of any single product exceeds 10 units, apply a 5% discount on that item's total price.
            
            if quantity > 10:
                discount_amount = min(0.05 * quantity * self.products[product], cart[product])
                return "bulk_5_discount", discount_amount

        # If total quantity exceeds 20 units, apply a 10% discount on the cart total.

        if total_quantity > 20:
            discount_amount = min(0.1 * total_price, total_price)
            return "bulk_10_discount", discount_amount

        # If total quantity exceeds 30 units & any single product quantity greater than 15, then apply a 50% discount on products which are above  15 quantity. The first 15 quantities have the original price and units above 15 will get a 50% discount.

        if total_quantity > 30 and any(quantity > 15 for quantity in quantities.values()):
            discounted_units = sum(max(0, quantity - 15) for quantity in quantities.values())
            discount_amount = min(0.5 * discounted_units * self.products[product], total_price)
            return "tiered_50_discount", discount_amount

        return None, 0


    # calculating gift wrap fee and shipping fee 
    
    def calculate_fees(self, quantities):
        gift_wrap_fee = sum(quantities.values())    
        shipping_fee = sum(quantities.values()) // 10 * 5
        return gift_wrap_fee, shipping_fee

    def checkout(self):
        cart = {}
        quantities = {}

        # Taking quantity of product as input and is it wrapped or not. 

        for product in self.products:
            quantity = int(input(f"Enter quantity for {product}: "))
            wrapped_as_gift = input(f"Is {product} wrapped as a gift? (yes/no): ").lower() == 'yes'

            cart[product] = quantity * self.products[product]
            if wrapped_as_gift:
                cart[product] += quantity

            quantities[product] = quantity

        # Calculate Subtotal

        subtotal = sum(cart.values())

        # Calculate Discounts

        discount_name, discount_amount = self.calculate_discount(cart, quantities)

        # Calculate Fees

        gift_wrap_fee, shipping_fee = self.calculate_fees(quantities)

        # Calculate Total

        total = subtotal - discount_amount + gift_wrap_fee + shipping_fee

        # printing product details and quantity of each product.

        for product in self.products:
            print(f"{product} - Quantity: {quantities[product]}, Total: ${cart[product]}")

        # Printing Subtotal

        print(f"\nSubtotal: ${subtotal}")

        # If any discounts are applicable then printing those Discounts

        if discount_name:
            print(f"\nDiscount Applied - {discount_name}: ${discount_amount}")

        # Printing Gift Wrap Fees, Shipping Fees and Total

        print(f"\nGift Wrap Fee: ${gift_wrap_fee}")
        print(f"Shipping Fee: ${shipping_fee}")

        print(f"\nTotal: ${total}")


# Creating a Object
catalogue = Catalogue()
catalogue.checkout()
