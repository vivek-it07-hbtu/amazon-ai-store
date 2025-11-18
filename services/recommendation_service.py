from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import redis
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Redis client for caching
try:
    redis_client = redis.Redis(
        host=os.getenv('REDIS_HOST', 'localhost'),
        port=int(os.getenv('REDIS_PORT', 6379)),
        decode_responses=True
    )
except:
    redis_client = None
    print("Redis not available - caching disabled")

# In-memory product storage (in production, fetch from MongoDB)
products_data = []

def load_products():
    """Load products from database or cache"""
    global products_data
    # Simulated product data for demonstration
    # In production, this would fetch from MongoDB
    products_data = [
        {
            'id': '1',
            'name': 'Laptop Computer',
            'category': 'Electronics',
            'price': 999.99,
            'tags': ['computer', 'laptop', 'electronics']
        },
        # Add more sample data as needed
    ]

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'service': 'Python Recommendation Service',
        'version': '1.0.0'
    })

@app.route('/recommendations/collaborative', methods=['POST'])
def collaborative_filtering():
    """
    Collaborative filtering recommendations
    Uses user behavior patterns to recommend products
    """
    data = request.json
    user_id = data.get('userId')
    
    # Implement collaborative filtering algorithm
    # This is a simplified version - production would use user purchase history
    
    recommendations = {
        'userId': user_id,
        'recommendations': [],
        'algorithm': 'collaborative_filtering'
    }
    
    return jsonify(recommendations)

@app.route('/recommendations/content-based', methods=['POST'])
def content_based_filtering():
    """
    Content-based filtering
    Recommends products similar to what user has viewed/purchased
    Uses TF-IDF and cosine similarity
    """
    data = request.json
    product_ids = data.get('productIds', [])
    
    if not products_data:
        load_products()
    
    # Create TF-IDF vectors from product descriptions
    # This demonstrates DSA concept: String matching algorithms
    vectorizer = TfidfVectorizer()
    
    recommendations = {
        'productIds': product_ids,
        'recommendations': [],
        'algorithm': 'content_based_filtering'
    }
    
    return jsonify(recommendations)

@app.route('/analytics/price-trends', methods=['POST'])
def price_trends():
    """
    Analyze price trends for products
    Uses time series analysis
    """
    data = request.json
    product_id = data.get('productId')
    days = data.get('days', 30)
    
    # Simulate price trend analysis
    # In production, this would analyze historical price data
    
    trend_data = {
        'productId': product_id,
        'days': days,
        'trend': 'stable',
        'average_price': 99.99,
        'min_price': 89.99,
        'max_price': 109.99,
        'recommendation': 'good_time_to_buy'
    }
    
    return jsonify(trend_data)

@app.route('/analytics/demand-prediction', methods=['POST'])
def demand_prediction():
    """
    Predict product demand using machine learning
    Helps with inventory management
    """
    data = request.json
    product_id = data.get('productId')
    
    # Implement demand prediction algorithm
    # This would use historical sales data and ML models
    
    prediction = {
        'productId': product_id,
        'predicted_demand': 150,
        'confidence': 0.85,
        'time_period': '7_days',
        'factors': ['seasonal', 'trending', 'price_competitive']
    }
    
    return jsonify(prediction)

@app.route('/search/optimize', methods=['POST'])
def optimize_search():
    """
    Optimize search results using ranking algorithms
    Implements relevance scoring and personalization
    """
    data = request.json
    query = data.get('query', '')
    user_id = data.get('userId')
    
    # Implement search optimization
    # Uses algorithms like BM25, TF-IDF with personalization
    
    results = {
        'query': query,
        'results': [],
        'total': 0,
        'personalized': user_id is not None
    }
    
    return jsonify(results)

@app.route('/clustering/similar-products', methods=['POST'])
def cluster_similar_products():
    """
    Group similar products using K-means clustering
    Demonstrates ML and DSA concepts
    """
    data = request.json
    category = data.get('category')
    
    # Implement K-means clustering
    # Groups products based on features like price, ratings, category
    
    clusters = {
        'category': category,
        'num_clusters': 5,
        'clusters': []
    }
    
    return jsonify(clusters)

if __name__ == '__main__':
    load_products()
    port = int(os.getenv('PYTHON_SERVICE_PORT', 8000))
    print(f'Python Recommendation Service running on port {port}')
    app.run(host='0.0.0.0', port=port, debug=True)
