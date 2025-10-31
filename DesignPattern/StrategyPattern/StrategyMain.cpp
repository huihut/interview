#include "StrategyMain.h"
#include "context.h"
#include "concrete_strategy.h"
#include <iostream>

using namespace std;

void testStrategyPattern() {
    cout << "=== 策略模式测试 ===" << endl;
    
    // 使用策略A
    cout << "\n创建上下文并使用策略A：" << endl;
    Context* context = new Context(new ConcreteStrategyA());
    context->contextInterface();
    
    // 切换到策略B
    cout << "\n切换到策略B：" << endl;
    context->setStrategy(new ConcreteStrategyB());
    context->contextInterface();
    
    // 切换到策略C
    cout << "\n切换到策略C：" << endl;
    context->setStrategy(new ConcreteStrategyC());
    context->contextInterface();
    
    delete context;
    
    cout << "\n=== 实际应用示例：排序策略 ===" << endl;
    
    // 实际应用：不同的排序策略
    class SortStrategy {
    public:
        virtual ~SortStrategy() {}
        virtual void sort(int arr[], int size) = 0;
    };
    
    class BubbleSortStrategy : public SortStrategy {
    public:
        void sort(int arr[], int size) override {
            cout << "使用冒泡排序" << endl;
            // 简化的冒泡排序实现
            for (int i = 0; i < size - 1; i++) {
                for (int j = 0; j < size - i - 1; j++) {
                    if (arr[j] > arr[j + 1]) {
                        int temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                    }
                }
            }
        }
    };
    
    class QuickSortStrategy : public SortStrategy {
    public:
        void sort(int arr[], int size) override {
            cout << "使用快速排序" << endl;
            // 这里仅作演示，实际应实现快速排序
            cout << "（快速排序实现省略）" << endl;
        }
    };
    
    class SortContext {
    private:
        SortStrategy* strategy_;
    public:
        SortContext(SortStrategy* strategy) : strategy_(strategy) {}
        ~SortContext() { delete strategy_; }
        
        void setStrategy(SortStrategy* strategy) {
            delete strategy_;
            strategy_ = strategy;
        }
        
        void executeSort(int arr[], int size) {
            strategy_->sort(arr, size);
        }
    };
    
    int arr[] = {5, 2, 8, 1, 9};
    int size = 5;
    
    cout << "\n原始数组：";
    for (int i = 0; i < size; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
    
    SortContext* sortContext = new SortContext(new BubbleSortStrategy());
    sortContext->executeSort(arr, size);
    
    cout << "排序后数组：";
    for (int i = 0; i < size; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
    
    delete sortContext;
}
