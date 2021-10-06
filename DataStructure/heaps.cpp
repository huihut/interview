#include <iostream>
#include <vector>

using namespace std;
class Heap
{
private:
    vector<int> heap;
    int left(int parent);
    int right(int parent);
    int parent(int child);
    void heapifyup(int index);
    void heapifydown(int index);

public:
    Heap() {}
    void Insert(int element);
    void DeleteMax();
    int ExtractMax();
    void showHeap();
    int Size();
};
int Heap::Size()
{
    return heap.size();
}
void Heap::Insert(int ele)
{
    heap.push_back(ele);
    heapifyup(heap.size() - 1);
}
void Heap::DeleteMax()
{
    if (heap.size() == 0)
    {
        cout << "Heap is Empty" << endl;
        return;
    }
    heap[0] = heap.at(heap.size() - 1);
    heap.pop_back();
    heapifydown(0);
    cout << "Element Deleted" << endl;
}
int Heap::ExtractMax()
{
    if (heap.size() == 0)
    {
        return -1;
    }
    else
        return heap.front();
}
void Heap::showHeap()
{
    vector<int>::iterator pos = heap.begin();
    cout << "Heap --> ";
    while (pos != heap.end())
    {
        cout << *pos << " ";
        pos++;
    }
    cout << endl;
}
int Heap::left(int parent)
{
    int left = 2 * parent + 1;
    if (left < heap.size())
        return left;
    else
        return -1;
}
int Heap::right(int parent)
{
    int right = 2 * parent + 2;
    if (right < heap.size())
        return right;
    else
        return -1;
}
int Heap::parent(int child)
{
    int p = (child - 1) / 2;
    if (child == 0)
        return -1;
    else
        return p;
}
void Heap::heapifyup(int in)
{
    if (in >= 0 && parent(in) >= 0 && heap[parent(in)] > heap[in])
    {
        int temp = heap[in];
        heap[in] = heap[parent(in)];
        heap[parent(in)] = temp;
        heapifyup(parent(in));
    }
}
void Heap::heapifydown(int in)
{
    int child = left(in);
    int child1 = right(in);
    if (child >= 0 && child1 >= 0 && heap[child] > heap[child1])
    {
        child = child1;
    }
    if (child > 0 && heap[in] > heap[child])
    {
        int t = heap[in];
        heap[in] = heap[child];
        heap[child] = t;
        heapifydown(child);
    }
}

int main()
{
    Heap h;
    while (1)
    {
        cout << "1.Insert Element" << endl;
        cout << "2.Delete Maximum Element" << endl;
        cout << "3.Extract Maximum Element" << endl;
        cout << "4.Show Heap" << endl;
        cout << "5.Exit" << endl;
        int c, e;
        cout << "Enter your choice: ";
        cin >> c;
        switch (c)
        {
        case 1:
            cout << "Enter the element to be inserted: ";
            cin >> e;
            h.Insert(e);
            break;
        case 2:
            h.DeleteMax();
            break;
        case 3:
            if (h.ExtractMax() == -1)
            {
                cout << "Heap is Empty" << endl;
            }
            else
                cout << "Maximum Element: " << h.ExtractMax() << endl;
            break;
        case 4:
            cout << "Displaying elements of Heap: ";
            h.showHeap();
            break;
        case 5:
            exit(1);
        default:
            cout << "Enter Correct Choice" << endl;
        }
    }
    return 0;
}

//delete insert extract and heapify
