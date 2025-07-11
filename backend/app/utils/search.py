from fuzzywuzzy import fuzz
from typing import List, Tuple
import re

def normalize_text(text: str) -> str:
    """Normalize text for better matching by removing special characters and converting to lowercase."""
    if not text:
        return ""
    # Remove special characters and convert to lowercase
    normalized = re.sub(r'[^\w\s]', '', text.lower())
    # Replace multiple spaces with single space
    normalized = re.sub(r'\s+', ' ', normalized).strip()
    return normalized

def calculate_similarity_score(query: str, target: str) -> float:
    """Calculate similarity score between query and target using multiple fuzzy matching algorithms."""
    if not query or not target:
        return 0.0
    
    # Normalize both strings
    query_norm = normalize_text(query)
    target_norm = normalize_text(target)
    
    if not query_norm or not target_norm:
        return 0.0
    
    # Use multiple fuzzy matching algorithms for better results
    ratio = fuzz.ratio(query_norm, target_norm)
    partial_ratio = fuzz.partial_ratio(query_norm, target_norm)
    token_sort_ratio = fuzz.token_sort_ratio(query_norm, target_norm)
    token_set_ratio = fuzz.token_set_ratio(query_norm, target_norm)
    
    # Weight the different algorithms
    # Partial ratio is good for finding substrings
    # Token ratios are good for word order variations
    # Regular ratio is good for overall similarity
    weighted_score = (
        partial_ratio * 0.4 +      # 40% weight for partial matches
        token_set_ratio * 0.3 +    # 30% weight for token set matches
        token_sort_ratio * 0.2 +   # 20% weight for token sort matches
        ratio * 0.1                # 10% weight for exact ratio
    )
    
    return weighted_score

def fuzzy_search(query: str, products: List[dict], threshold: float = 60.0) -> List[Tuple[dict, float]]:
    """
    Perform fuzzy search on products.
    
    Args:
        query: Search query string
        products: List of product dictionaries
        threshold: Minimum similarity score (0-100) to include in results
    
    Returns:
        List of tuples containing (product, similarity_score) sorted by score descending
    """
    if not query or not products:
        return []
    
    results = []
    
    for product in products:
        # Search in product name
        name_score = calculate_similarity_score(query, product.get('name', ''))
        
        # Search in product description
        description_score = calculate_similarity_score(query, product.get('description', ''))
        
        # Search in category name
        category_score = 0.0
        if product.get('category') and product['category'].get('name'):
            category_score = calculate_similarity_score(query, product['category']['name'])
        
        # Take the highest score from all fields
        max_score = max(name_score, description_score, category_score)
        
        if max_score >= threshold:
            results.append((product, max_score))
    
    # Sort by similarity score (highest first)
    results.sort(key=lambda x: x[1], reverse=True)
    
    return results

def get_search_suggestions(query: str, products: List[dict], max_suggestions: int = 5) -> List[str]:
    """
    Get search suggestions based on partial matches.
    
    Args:
        query: Partial search query
        products: List of product dictionaries
        max_suggestions: Maximum number of suggestions to return
    
    Returns:
        List of suggested search terms
    """
    if not query or not products:
        return []
    
    suggestions = set()
    query_lower = query.lower()
    
    for product in products:
        # Check product name
        name = product.get('name', '').lower()
        if query_lower in name:
            # Extract the matching part of the name
            words = name.split()
            for word in words:
                if query_lower in word and len(word) > len(query):
                    suggestions.add(word)
        
        # Check category name
        if product.get('category') and product['category'].get('name'):
            category_name = product['category']['name'].lower()
            if query_lower in category_name:
                words = category_name.split()
                for word in words:
                    if query_lower in word and len(word) > len(query):
                        suggestions.add(word)
    
    # Return top suggestions
    return list(suggestions)[:max_suggestions] 