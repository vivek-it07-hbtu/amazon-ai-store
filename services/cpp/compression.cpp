/*
 * Data Compression Module for Image/File Storage
 * Implements compression algorithms for efficient storage
 * Demonstrates: Huffman Coding, Run-Length Encoding
 */

#include <iostream>
#include <string>
#include <queue>
#include <unordered_map>
#include <vector>

using namespace std;

// Huffman Tree Node
struct HuffmanNode {
    char data;
    unsigned freq;
    HuffmanNode *left, *right;
    
    HuffmanNode(char data, unsigned freq) {
        this->data = data;
        this->freq = freq;
        left = right = nullptr;
    }
};

// Comparison object for priority queue
struct Compare {
    bool operator()(HuffmanNode* l, HuffmanNode* r) {
        return l->freq > r->freq;
    }
};

class HuffmanCompression {
private:
    unordered_map<char, string> huffmanCodes;
    HuffmanNode* root;
    
    void generateCodes(HuffmanNode* node, string code) {
        if (!node) return;
        
        if (!node->left && !node->right) {
            huffmanCodes[node->data] = code;
        }
        
        generateCodes(node->left, code + "0");
        generateCodes(node->right, code + "1");
    }
    
public:
    HuffmanCompression() : root(nullptr) {}
    
    void buildHuffmanTree(const string& text) {
        // Calculate frequency
        unordered_map<char, unsigned> freq;
        for (char ch : text) {
            freq[ch]++;
        }
        
        // Create priority queue
        priority_queue<HuffmanNode*, vector<HuffmanNode*>, Compare> pq;
        
        for (auto& pair : freq) {
            pq.push(new HuffmanNode(pair.first, pair.second));
        }
        
        // Build Huffman Tree
        while (pq.size() > 1) {
            HuffmanNode* left = pq.top(); pq.pop();
            HuffmanNode* right = pq.top(); pq.pop();
            
            HuffmanNode* merged = new HuffmanNode('\0', left->freq + right->freq);
            merged->left = left;
            merged->right = right;
            
            pq.push(merged);
        }
        
        root = pq.top();
        generateCodes(root, "");
    }
    
    string compress(const string& text) {
        string compressed = "";
        for (char ch : text) {
            compressed += huffmanCodes[ch];
        }
        return compressed;
    }
    
    void displayCodes() {
        cout << "Huffman Codes:" << endl;
        for (auto& pair : huffmanCodes) {
            cout << pair.first << ": " << pair.second << endl;
        }
    }
    
    double getCompressionRatio(const string& original, const string& compressed) {
        int originalBits = original.length() * 8;
        int compressedBits = compressed.length();
        return (1.0 - (double)compressedBits / originalBits) * 100;
    }
};

// Run-Length Encoding
class RLECompression {
public:
    static string compress(const string& text) {
        string compressed = "";
        int n = text.length();
        
        for (int i = 0; i < n; i++) {
            int count = 1;
            while (i < n - 1 && text[i] == text[i + 1]) {
                count++;
                i++;
            }
            compressed += text[i] + to_string(count);
        }
        
        return compressed;
    }
    
    static string decompress(const string& compressed) {
        string decompressed = "";
        int n = compressed.length();
        
        for (int i = 0; i < n; i += 2) {
            char ch = compressed[i];
            int count = compressed[i + 1] - '0';
            decompressed += string(count, ch);
        }
        
        return decompressed;
    }
};

void demonstrateCompression() {
    string text = "AAAAAABBBCCCDDEEEEE";
    
    cout << "Original text: " << text << endl;
    cout << "Original size: " << text.length() * 8 << " bits\n" << endl;
    
    // Huffman Compression
    cout << "=== Huffman Compression ===" << endl;
    HuffmanCompression huffman;
    huffman.buildHuffmanTree(text);
    huffman.displayCodes();
    
    string huffmanCompressed = huffman.compress(text);
    cout << "\nCompressed: " << huffmanCompressed << endl;
    cout << "Compressed size: " << huffmanCompressed.length() << " bits" << endl;
    cout << "Compression ratio: " << huffman.getCompressionRatio(text, huffmanCompressed) << "%\n" << endl;
    
    // Run-Length Encoding
    cout << "=== Run-Length Encoding ===" << endl;
    string rleCompressed = RLECompression::compress(text);
    cout << "Compressed: " << rleCompressed << endl;
    cout << "Decompressed: " << RLECompression::decompress(rleCompressed) << endl;
}

int main() {
    cout << "🗜️  Data Compression Module" << endl;
    cout << "Demonstrating Huffman Coding and RLE" << endl;
    cout << "===================================\n" << endl;
    
    demonstrateCompression();
    
    return 0;
}
