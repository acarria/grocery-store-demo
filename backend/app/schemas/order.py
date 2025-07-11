from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.models.order import OrderStatus

class OrderBase(BaseModel):
    shipping_address: str
    shipping_city: str
    shipping_state: str
    shipping_zip: str
    shipping_country: str
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[dict]  # Each dict should have product_id and quantity

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price_at_time: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class OrderResponse(OrderBase):
    id: int
    user_id: int
    order_number: str
    status: OrderStatus
    total_amount: float
    order_items: List[OrderItemResponse]
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True 