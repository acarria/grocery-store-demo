from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.core.database import get_db
from app.models.product import Product
from app.schemas.product import ProductResponse, ProductCreate, ProductUpdate
from app.utils.search import fuzzy_search, get_search_suggestions
from app.core.logging import get_logger

router = APIRouter()
logger = get_logger("products")

@router.get("/", response_model=List[ProductResponse])
def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    fuzzy_search_enabled: bool = Query(True, description="Enable fuzzy search for better typo tolerance"),
    db: Session = Depends(get_db)
):
    """Get all products with optional filtering and fuzzy search"""
    query = db.query(Product).options(joinedload(Product.category)).filter(Product.is_active == True)
    
    if category_id:
        query = query.filter(Product.category_id == category_id)
    
    # Get all products first for fuzzy search
    all_products = query.all()
    
    if search:
        if fuzzy_search_enabled:
            # Convert SQLAlchemy objects to dictionaries for fuzzy search
            products_dict = []
            for product in all_products:
                product_dict = {
                    'id': product.id,
                    'name': product.name,
                    'description': product.description,
                    'price': product.price,
                    'stock_quantity': product.stock_quantity,
                    'image_url': product.image_url,
                    'is_active': product.is_active,
                    'category_id': product.category_id,
                    'created_at': product.created_at,
                    'updated_at': product.updated_at,
                    'category': {
                        'id': product.category.id,
                        'name': product.category.name,
                        'description': product.category.description
                    } if product.category else None
                }
                products_dict.append(product_dict)
            
            # Perform fuzzy search
            fuzzy_results = fuzzy_search(search, products_dict, threshold=50.0)
            # Extract just the products from the results
            filtered_products = [result[0] for result in fuzzy_results]
            
            # Convert back to SQLAlchemy objects
            product_ids = [p['id'] for p in filtered_products]
            products = [p for p in all_products if p.id in product_ids]
        else:
            # Use traditional SQL LIKE search
            query = query.filter(Product.name.ilike(f"%{search}%"))
            products = query.offset(skip).limit(limit).all()
    else:
        products = all_products
    
    # Apply pagination
    if not search or not fuzzy_search_enabled:
        products = products[skip:skip + limit]
    
    return products

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a specific product by ID"""
    product = db.query(Product).options(joinedload(Product.category)).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product

@router.get("/search/suggestions")
def get_search_suggestions_endpoint(
    query: str = Query(..., min_length=1, description="Partial search query"),
    max_suggestions: int = Query(5, ge=1, le=10, description="Maximum number of suggestions"),
    db: Session = Depends(get_db)
):
    """Get search suggestions based on partial matches"""
    if len(query) < 2:
        return {"suggestions": []}
    
    # Get all products
    products = db.query(Product).options(joinedload(Product.category)).filter(Product.is_active == True).all()
    
    # Convert to dictionaries for search utility
    products_dict = []
    for product in products:
        product_dict = {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'stock_quantity': product.stock_quantity,
            'image_url': product.image_url,
            'is_active': product.is_active,
            'category_id': product.category_id,
            'created_at': product.created_at,
            'updated_at': product.updated_at,
            'category': {
                'id': product.category.id,
                'name': product.category.name,
                'description': product.category.description
            } if product.category else None
        }
        products_dict.append(product_dict)
    
    suggestions = get_search_suggestions(query, products_dict, max_suggestions)
    return {"suggestions": suggestions} 