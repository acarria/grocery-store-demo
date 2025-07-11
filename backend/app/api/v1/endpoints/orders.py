from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.order import Order, OrderItem
from app.models.cart import Cart, CartItem
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse
from app.core.security import verify_token
from fastapi.security import OAuth2PasswordBearer
import uuid
from app.models.product import Product
from app.core.logging import get_logger
import structlog.contextvars

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
logger = get_logger("orders")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    email = verify_token(token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    structlog.contextvars.bind_contextvars(user_id=user.id)
    return user

@router.get("/", response_model=List[OrderResponse])
def get_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get user's order history"""
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    # Ensure order_items is always present in the response
    return [
        {
            **order.__dict__,
            "order_items": [item for item in order.items]
        }
        for order in orders
    ]

@router.post("/", response_model=OrderResponse)
def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new order from API checkout"""
    # Validate stock for each item
    total_amount = 0
    order_items = []
    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item['product_id']).with_for_update().first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item['product_id']} not found.")
        if item['quantity'] > product.stock_quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Only {product.stock_quantity} left in stock for {product.name}."
            )
        total_amount += product.price * item['quantity']
        order_items.append((product, item['quantity'], product.price))
    # Create order
    order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
    order = Order(
        user_id=current_user.id,
        order_number=order_number,
        total_amount=total_amount,
        shipping_address=order_data.shipping_address,
        shipping_city=order_data.shipping_city,
        shipping_state=order_data.shipping_state,
        shipping_zip=order_data.shipping_zip,
        shipping_country=order_data.shipping_country,
        notes=order_data.notes
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    # Create order items and decrement stock
    for product, quantity, price in order_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=quantity,
            price_at_time=price
        )
        db.add(order_item)
        product.stock_quantity -= quantity
        db.add(product)
    db.commit()
    db.refresh(order)
    return order 