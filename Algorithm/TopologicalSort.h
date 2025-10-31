#ifndef TOPOLOGICAL_SORT_H
#define TOPOLOGICAL_SORT_H

#include <iostream>
#include <vector>
#include <queue>
#include <stack>

using namespace std;

// 拓扑排序 - Kahn算法（基于BFS）
// 时间复杂度：O(V+E)，空间复杂度：O(V)
class TopologicalSortKahn {
public:
    // 拓扑排序
    // 参数：numVertices - 顶点数，edges - 边的列表（有向边）
    // 返回：拓扑排序结果，如果存在环则返回空vector
    static vector<int> topologicalSort(int numVertices, vector<pair<int, int>>& edges) {
        vector<int> result;
        vector<int> inDegree(numVertices, 0);  // 入度数组
        vector<vector<int>> adjList(numVertices);  // 邻接表
        
        // 构建邻接表和入度数组
        for (auto& edge : edges) {
            int from = edge.first;
            int to = edge.second;
            adjList[from].push_back(to);
            inDegree[to]++;
        }
        
        // 将所有入度为0的顶点加入队列
        queue<int> q;
        for (int i = 0; i < numVertices; i++) {
            if (inDegree[i] == 0) {
                q.push(i);
            }
        }
        
        // BFS处理
        while (!q.empty()) {
            int curr = q.front();
            q.pop();
            result.push_back(curr);
            
            // 遍历当前顶点的所有邻接顶点
            for (int neighbor : adjList[curr]) {
                inDegree[neighbor]--;
                if (inDegree[neighbor] == 0) {
                    q.push(neighbor);
                }
            }
        }
        
        // 如果结果中的顶点数不等于总顶点数，说明存在环
        if (result.size() != numVertices) {
            return vector<int>();  // 返回空vector表示存在环
        }
        
        return result;
    }
};

// 拓扑排序 - DFS算法
// 时间复杂度：O(V+E)，空间复杂度：O(V)
class TopologicalSortDFS {
private:
    static void dfs(int v, vector<vector<int>>& adjList, vector<bool>& visited, stack<int>& stk) {
        visited[v] = true;
        
        // 递归访问所有邻接顶点
        for (int neighbor : adjList[v]) {
            if (!visited[neighbor]) {
                dfs(neighbor, adjList, visited, stk);
            }
        }
        
        // 当前顶点处理完毕，压入栈中
        stk.push(v);
    }
    
public:
    // 拓扑排序
    // 参数：numVertices - 顶点数，edges - 边的列表（有向边）
    // 返回：拓扑排序结果
    static vector<int> topologicalSort(int numVertices, vector<pair<int, int>>& edges) {
        vector<int> result;
        vector<vector<int>> adjList(numVertices);  // 邻接表
        vector<bool> visited(numVertices, false);
        stack<int> stk;
        
        // 构建邻接表
        for (auto& edge : edges) {
            int from = edge.first;
            int to = edge.second;
            adjList[from].push_back(to);
        }
        
        // 对所有未访问的顶点进行DFS
        for (int i = 0; i < numVertices; i++) {
            if (!visited[i]) {
                dfs(i, adjList, visited, stk);
            }
        }
        
        // 从栈中弹出元素得到拓扑排序结果
        while (!stk.empty()) {
            result.push_back(stk.top());
            stk.pop();
        }
        
        return result;
    }
};

// 测试函数
void testTopologicalSort() {
    cout << "=== 拓扑排序测试 ===" << endl;
    
    // 测试用例：6个顶点的有向无环图
    // 边：5->2, 5->0, 4->0, 4->1, 2->3, 3->1
    int numVertices = 6;
    vector<pair<int, int>> edges = {
        {5, 2}, {5, 0}, {4, 0}, {4, 1}, {2, 3}, {3, 1}
    };
    
    // Kahn算法
    cout << "Kahn算法（BFS）结果：";
    vector<int> result1 = TopologicalSortKahn::topologicalSort(numVertices, edges);
    if (result1.empty()) {
        cout << "图中存在环！" << endl;
    } else {
        for (int v : result1) {
            cout << v << " ";
        }
        cout << endl;
    }
    
    // DFS算法
    cout << "DFS算法结果：";
    vector<int> result2 = TopologicalSortDFS::topologicalSort(numVertices, edges);
    for (int v : result2) {
        cout << v << " ";
    }
    cout << endl;
    
    // 测试有环的情况
    cout << "\n测试有环的图：" << endl;
    vector<pair<int, int>> cycleEdges = {
        {0, 1}, {1, 2}, {2, 0}
    };
    vector<int> result3 = TopologicalSortKahn::topologicalSort(3, cycleEdges);
    if (result3.empty()) {
        cout << "检测到环！" << endl;
    }
}

#endif // TOPOLOGICAL_SORT_H
