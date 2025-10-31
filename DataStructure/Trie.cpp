#include <iostream>
#include <string>
#include <unordered_map>

using namespace std;

// 字典树（前缀树）节点
class TrieNode {
public:
    unordered_map<char, TrieNode*> children;  // 子节点映射
    bool isEndOfWord;  // 标记是否为单词结尾
    
    TrieNode() : isEndOfWord(false) {}
    
    ~TrieNode() {
        for (auto& pair : children) {
            delete pair.second;
        }
    }
};

// 字典树（前缀树）
// 用于高效存储和检索字符串集合
// 时间复杂度：插入O(m)，查找O(m)，m为字符串长度
// 空间复杂度：O(ALPHABET_SIZE * N * M)，N为字符串数量，M为平均长度
class Trie {
private:
    TrieNode* root;
    
public:
    // 构造函数
    Trie() {
        root = new TrieNode();
    }
    
    // 析构函数
    ~Trie() {
        delete root;
    }
    
    // 插入单词
    void insert(const string& word) {
        TrieNode* curr = root;
        
        for (char ch : word) {
            // 如果字符不存在，创建新节点
            if (curr->children.find(ch) == curr->children.end()) {
                curr->children[ch] = new TrieNode();
            }
            curr = curr->children[ch];
        }
        
        // 标记单词结尾
        curr->isEndOfWord = true;
    }
    
    // 搜索单词是否存在
    bool search(const string& word) {
        TrieNode* curr = root;
        
        for (char ch : word) {
            if (curr->children.find(ch) == curr->children.end()) {
                return false;
            }
            curr = curr->children[ch];
        }
        
        return curr->isEndOfWord;
    }
    
    // 检查是否存在以给定前缀开头的单词
    bool startsWith(const string& prefix) {
        TrieNode* curr = root;
        
        for (char ch : prefix) {
            if (curr->children.find(ch) == curr->children.end()) {
                return false;
            }
            curr = curr->children[ch];
        }
        
        return true;
    }
    
    // 删除单词
    bool remove(const string& word) {
        return removeHelper(root, word, 0);
    }
    
private:
    // 删除辅助函数（递归）
    bool removeHelper(TrieNode* node, const string& word, int depth) {
        if (!node) {
            return false;
        }
        
        // 到达单词末尾
        if (depth == word.length()) {
            if (!node->isEndOfWord) {
                return false;  // 单词不存在
            }
            
            node->isEndOfWord = false;
            
            // 如果没有子节点，可以删除该节点
            return node->children.empty();
        }
        
        char ch = word[depth];
        if (node->children.find(ch) == node->children.end()) {
            return false;  // 单词不存在
        }
        
        TrieNode* childNode = node->children[ch];
        bool shouldDeleteChild = removeHelper(childNode, word, depth + 1);
        
        // 如果子节点应该被删除
        if (shouldDeleteChild) {
            delete childNode;
            node->children.erase(ch);
            
            // 如果当前节点不是单词结尾且没有其他子节点，返回true表示可以删除
            return !node->isEndOfWord && node->children.empty();
        }
        
        return false;
    }
};

// 测试函数
void testTrie() {
    cout << "=== 字典树（Trie）测试 ===" << endl;
    
    Trie trie;
    
    // 插入单词
    cout << "插入单词：apple, app, application, apply, banana, band" << endl;
    trie.insert("apple");
    trie.insert("app");
    trie.insert("application");
    trie.insert("apply");
    trie.insert("banana");
    trie.insert("band");
    
    // 搜索单词
    cout << "\n搜索测试：" << endl;
    cout << "search('apple'): " << (trie.search("apple") ? "找到" : "未找到") << endl;
    cout << "search('app'): " << (trie.search("app") ? "找到" : "未找到") << endl;
    cout << "search('appl'): " << (trie.search("appl") ? "找到" : "未找到") << endl;
    cout << "search('banana'): " << (trie.search("banana") ? "找到" : "未找到") << endl;
    cout << "search('orange'): " << (trie.search("orange") ? "找到" : "未找到") << endl;
    
    // 前缀搜索
    cout << "\n前缀搜索测试：" << endl;
    cout << "startsWith('app'): " << (trie.startsWith("app") ? "存在" : "不存在") << endl;
    cout << "startsWith('ban'): " << (trie.startsWith("ban") ? "存在" : "不存在") << endl;
    cout << "startsWith('ora'): " << (trie.startsWith("ora") ? "存在" : "不存在") << endl;
    
    // 删除单词
    cout << "\n删除单词 'app'：" << endl;
    trie.remove("app");
    cout << "search('app'): " << (trie.search("app") ? "找到" : "未找到") << endl;
    cout << "search('apple'): " << (trie.search("apple") ? "找到" : "未找到") << endl;
    cout << "search('application'): " << (trie.search("application") ? "找到" : "未找到") << endl;
}

int main() {
    testTrie();
    return 0;
}
