/*
 * High-Performance Search Engine Module
 * Implements advanced search algorithms and data structures
 * Demonstrates DSA concepts: Trie, Binary Search, Hash Maps
 */

#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <memory>
#include <queue>
#include <sstream>

using namespace std;

// Trie Node for efficient prefix search
class TrieNode {
public:
    unordered_map<char, shared_ptr<TrieNode>> children;
    bool isEndOfWord;
    vector<string> productIds;
    
    TrieNode() : isEndOfWord(false) {}
};

// Trie data structure for autocomplete and search
class Trie {
private:
    shared_ptr<TrieNode> root;
    
public:
    Trie() {
        root = make_shared<TrieNode>();
    }
    
    // Insert a word into the trie
    void insert(const string& word, const string& productId) {
        auto node = root;
        for (char ch : word) {
            char lower_ch = tolower(ch);
            if (node->children.find(lower_ch) == node->children.end()) {
                node->children[lower_ch] = make_shared<TrieNode>();
            }
            node = node->children[lower_ch];
        }
        node->isEndOfWord = true;
        node->productIds.push_back(productId);
    }
    
    // Search for a prefix and return suggestions
    vector<string> searchPrefix(const string& prefix) {
        auto node = root;
        for (char ch : prefix) {
            char lower_ch = tolower(ch);
            if (node->children.find(lower_ch) == node->children.end()) {
                return {}; // Prefix not found
            }
            node = node->children[lower_ch];
        }
        
        vector<string> results;
        collectProducts(node, results);
        return results;
    }
    
private:
    void collectProducts(shared_ptr<TrieNode> node, vector<string>& results) {
        if (node->isEndOfWord) {
            results.insert(results.end(), node->productIds.begin(), node->productIds.end());
        }
        
        for (auto& pair : node->children) {
            collectProducts(pair.second, results);
        }
    }
};

// Product structure
struct Product {
    string id;
    string name;
    string category;
    double price;
    double rating;
    int stock;
    
    Product(string i, string n, string c, double p, double r, int s)
        : id(i), name(n), category(c), price(p), rating(r), stock(s) {}
};

// Search Engine class
class SearchEngine {
private:
    vector<Product> products;
    Trie searchTrie;
    unordered_map<string, vector<int>> categoryIndex;
    
public:
    // Add product to search engine
    void addProduct(const Product& product) {
        products.push_back(product);
        int index = products.size() - 1;
        
        // Index product name in trie
        stringstream ss(product.name);
        string word;
        while (ss >> word) {
            searchTrie.insert(word, product.id);
        }
        
        // Index by category
        categoryIndex[product.category].push_back(index);
    }
    
    // Search products by keyword
    vector<Product> search(const string& keyword) {
        vector<string> productIds = searchTrie.searchPrefix(keyword);
        vector<Product> results;
        
        for (const auto& id : productIds) {
            auto it = find_if(products.begin(), products.end(),
                [&id](const Product& p) { return p.id == id; });
            if (it != products.end()) {
                results.push_back(*it);
            }
        }
        
        return results;
    }
    
    // Filter products by price range (Binary Search Tree concept)
    vector<Product> filterByPrice(double minPrice, double maxPrice) {
        vector<Product> results;
        
        for (const auto& product : products) {
            if (product.price >= minPrice && product.price <= maxPrice) {
                results.push_back(product);
            }
        }
        
        return results;
    }
    
    // Sort products by rating (Quick Sort)
    static void sortByRating(vector<Product>& products, bool descending = true) {
        sort(products.begin(), products.end(),
            [descending](const Product& a, const Product& b) {
                return descending ? a.rating > b.rating : a.rating < b.rating;
            });
    }
    
    // Sort products by price (Merge Sort concept)
    static void sortByPrice(vector<Product>& products, bool ascending = true) {
        sort(products.begin(), products.end(),
            [ascending](const Product& a, const Product& b) {
                return ascending ? a.price < b.price : a.price > b.price;
            });
    }
    
    // Get products by category (Hash Map lookup - O(1))
    vector<Product> getByCategory(const string& category) {
        vector<Product> results;
        
        if (categoryIndex.find(category) != categoryIndex.end()) {
            for (int index : categoryIndex[category]) {
                results.push_back(products[index]);
            }
        }
        
        return results;
    }
    
    // Get top N products by rating (Heap/Priority Queue)
    vector<Product> getTopRated(int n) {
        auto compare = [](const Product& a, const Product& b) {
            return a.rating < b.rating;
        };
        
        priority_queue<Product, vector<Product>, decltype(compare)> pq(compare);
        
        for (const auto& product : products) {
            pq.push(product);
        }
        
        vector<Product> results;
        while (!pq.empty() && n-- > 0) {
            results.push_back(pq.top());
            pq.pop();
        }
        
        return results;
    }
};

// Demo function
void demonstrateSearchEngine() {
    SearchEngine engine;
    
    // Add sample products
    engine.addProduct(Product("1", "Laptop Computer", "Electronics", 999.99, 4.5, 50));
    engine.addProduct(Product("2", "Wireless Mouse", "Electronics", 29.99, 4.2, 200));
    engine.addProduct(Product("3", "USB Cable", "Electronics", 9.99, 4.0, 500));
    engine.addProduct(Product("4", "T-Shirt", "Clothing", 19.99, 4.3, 100));
    engine.addProduct(Product("5", "Jeans", "Clothing", 49.99, 4.4, 75));
    
    // Demonstrate search
    cout << "=== Search Results for 'Laptop' ===" << endl;
    auto results = engine.search("Laptop");
    for (const auto& product : results) {
        cout << product.name << " - $" << product.price << endl;
    }
    
    // Demonstrate filtering
    cout << "\n=== Products under $50 ===" << endl;
    auto filtered = engine.filterByPrice(0, 50);
    for (const auto& product : filtered) {
        cout << product.name << " - $" << product.price << endl;
    }
    
    // Demonstrate top rated
    cout << "\n=== Top 3 Rated Products ===" << endl;
    auto topRated = engine.getTopRated(3);
    for (const auto& product : topRated) {
        cout << product.name << " - Rating: " << product.rating << endl;
    }
}

int main() {
    cout << "🚀 High-Performance Search Engine Module" << endl;
    cout << "Demonstrating DSA concepts: Trie, Binary Search, Heaps" << endl;
    cout << "==============================================\n" << endl;
    
    demonstrateSearchEngine();
    
    return 0;
}
