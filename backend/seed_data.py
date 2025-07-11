#!/usr/bin/env python3
"""
Seed script to populate the database with sample data
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.core.database import Base
from app.models import Category, Product, User, UserRole
from app.core.security import get_password_hash
from app.main import logger

def clear_all_data(db):
    from app.models.order import Order, OrderItem
    from app.models.cart import Cart, CartItem
    from app.models.product import Product
    from app.models.category import Category
    from app.models.user import User
    # Delete in order of dependencies (children first)
    db.query(OrderItem).delete()
    db.query(Order).delete()
    db.query(CartItem).delete()
    db.query(Cart).delete()
    db.query(Product).delete()
    db.query(Category).delete()
    db.query(User).delete()
    db.commit()

def create_sample_data():
    db = SessionLocal()
    
    try:
        clear_all_data(db)
        db.close()
        db = SessionLocal()  # Reopen session after clearing

        # Create categories
        categories = [
            Category(name="Fruits & Vegetables", description="Fresh fruits and vegetables"),
            Category(name="Dairy & Eggs", description="Milk, cheese, eggs, and dairy products"),
            Category(name="Meat & Seafood", description="Fresh meat, poultry, and seafood"),
            Category(name="Bakery", description="Fresh bread, pastries, and baked goods"),
            Category(name="Pantry", description="Canned goods, pasta, rice, and dry goods"),
            Category(name="Beverages", description="Juices, sodas, water, and other drinks"),
        ]
        
        for category in categories:
            db.add(category)
        db.commit()
        db.flush()  # Ensure category IDs are assigned
        # Log categories for debugging
        all_categories = db.query(Category).all()
        logger.info("seed.categories", count=len(all_categories), categories=[c.id for c in all_categories])

        # Map category names to IDs
        category_map = {c.name: c.id for c in all_categories}
        
        # Create products
        products = [
            # Fruits & Vegetables
            Product(
                name="Organic Bananas",
                description="Fresh organic bananas, perfect for smoothies or snacking",
                price=2.99,
                stock_quantity=50,
                category_id=category_map["Fruits & Vegetables"],
                image_url="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400"
            ),
            Product(
                name="Fresh Strawberries",
                description="Sweet and juicy strawberries, perfect for desserts",
                price=4.99,
                stock_quantity=25,
                category_id=category_map["Fruits & Vegetables"],
                image_url="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400"
            ),
            Product(
                name="Organic Spinach",
                description="Fresh organic spinach leaves, great for salads",
                price=3.49,
                stock_quantity=30,
                category_id=category_map["Fruits & Vegetables"],
                image_url="https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400"
            ),
            Product(
                name="Red Bell Peppers",
                description="Sweet red bell peppers, perfect for cooking",
                price=2.49,
                stock_quantity=0,  # Out of stock
                category_id=category_map["Fruits & Vegetables"],
                image_url="https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400"
            ),
            
            # Dairy & Eggs
            Product(
                name="Organic Whole Milk",
                description="Fresh organic whole milk from local farms",
                price=4.99,
                stock_quantity=20,
                category_id=category_map["Dairy & Eggs"],
                image_url="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400"
            ),
            Product(
                name="Free Range Eggs",
                description="Farm fresh free range eggs, 12 count",
                price=5.99,
                stock_quantity=15,
                category_id=category_map["Dairy & Eggs"],
                image_url="https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400"
            ),
            Product(
                name="Aged Cheddar Cheese",
                description="Sharp aged cheddar cheese, perfect for sandwiches",
                price=6.99,
                stock_quantity=8,  # Low stock
                category_id=category_map["Dairy & Eggs"],
                image_url="https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400"
            ),
            
            # Meat & Seafood
            Product(
                name="Grass-Fed Beef Steak",
                description="Premium grass-fed beef steak, 8oz",
                price=12.99,
                stock_quantity=10,
                category_id=category_map["Meat & Seafood"],
                image_url="https://images.unsplash.com/photo-1544025162-d76694265947?w=400"
            ),
            Product(
                name="Fresh Salmon Fillet",
                description="Wild-caught salmon fillet, perfect for grilling",
                price=15.99,
                stock_quantity=5,  # Low stock
                category_id=category_map["Meat & Seafood"],
                image_url="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400"
            ),
            
            # Bakery
            Product(
                name="Artisan Sourdough Bread",
                description="Fresh baked artisan sourdough bread",
                price=4.99,
                stock_quantity=12,
                category_id=category_map["Bakery"],
                image_url="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400"
            ),
            Product(
                name="Chocolate Croissants",
                description="Buttery chocolate croissants, baked fresh daily",
                price=3.99,
                stock_quantity=20,
                category_id=category_map["Bakery"],
                image_url="https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400"
            ),
            
            # Pantry
            Product(
                name="Organic Quinoa",
                description="Premium organic quinoa, perfect for healthy meals",
                price=8.99,
                stock_quantity=25,
                category_id=category_map["Pantry"],
                image_url="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"
            ),
            Product(
                name="Extra Virgin Olive Oil",
                description="Premium extra virgin olive oil, cold pressed",
                price=12.99,
                stock_quantity=18,
                category_id=category_map["Pantry"],
                image_url="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400"
            ),
            
            # Beverages
            Product(
                name="Fresh Orange Juice",
                description="100% fresh squeezed orange juice",
                price=5.99,
                stock_quantity=15,
                category_id=category_map["Beverages"],
                image_url="https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400"
            ),
            Product(
                name="Sparkling Water",
                description="Natural sparkling water with no added flavors",
                price=2.99,
                stock_quantity=30,
                category_id=category_map["Beverages"],
                image_url="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400"
            ),
        ]
        
        for product in products:
            db.add(product)
        db.commit()
        db.flush()  # Ensure product IDs are assigned
        
        # Create admin user
        admin_user = User(
            username="admin",
            email="admin@savegowholesale.com",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.ADMIN,
            is_active=True
        )
        db.add(admin_user)
        
        # Create sample customer user
        customer_user = User(
            username="customer",
            email="customer@savegowholesale.com",
            hashed_password=get_password_hash("customer123"),
            role=UserRole.CUSTOMER,
            is_active=True
        )
        db.add(customer_user)
        db.commit()
        db.flush()
        
        # Create sample orders for the customer user
        from app.models.order import Order, OrderItem, OrderStatus
        # Fetch some products to use in orders
        product1 = db.query(Product).filter(Product.name == "Organic Bananas").first()
        product2 = db.query(Product).filter(Product.name == "Free Range Eggs").first()
        product3 = db.query(Product).filter(Product.name == "Artisan Sourdough Bread").first()
        product4 = db.query(Product).filter(Product.name == "Fresh Orange Juice").first()
        
        if all([product1, product2, product3, product4]):
            order1 = Order(
                user_id=customer_user.id,
                order_number="ORD-1234ABCD",
                status=OrderStatus.DELIVERED,
                total_amount=product1.price * 2 + product2.price * 1,
                shipping_address="123 Main St",
                shipping_city="San Francisco",
                shipping_state="CA",
                shipping_zip="94105",
                shipping_country="USA",
                notes="Leave at the door."
            )
            db.add(order1)
            db.commit()
            db.refresh(order1)
            db.add_all([
                OrderItem(order_id=order1.id, product_id=product1.id, quantity=2, price_at_time=product1.price),
                OrderItem(order_id=order1.id, product_id=product2.id, quantity=1, price_at_time=product2.price),
            ])
            db.commit()
            
            order2 = Order(
                user_id=customer_user.id,
                order_number="ORD-5678EFGH",
                status=OrderStatus.SHIPPED,
                total_amount=product3.price * 1 + product4.price * 2,
                shipping_address="123 Main St",
                shipping_city="San Francisco",
                shipping_state="CA",
                shipping_zip="94105",
                shipping_country="USA",
                notes="Ring the bell."
            )
            db.add(order2)
            db.commit()
            db.refresh(order2)
            db.add_all([
                OrderItem(order_id=order2.id, product_id=product3.id, quantity=1, price_at_time=product3.price),
                OrderItem(order_id=order2.id, product_id=product4.id, quantity=2, price_at_time=product4.price),
            ])
            db.commit()
            logger.info("seed.created_orders", customer=customer_user.email, orders=2)
        else:
            logger.warning("seed.orders_skipped_missing_products")
        
        logger.info("seed.success", categories=len(categories), products=len(products))
        logger.info("seed.created_admin", email=admin_user.email)
        logger.info("seed.created_customer", email=customer_user.email)
        logger.info("seed.credentials", admin=admin_user.email, customer=customer_user.email)
        
    except Exception as e:
        logger.error("seed.error", error=str(e))
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    create_sample_data() 