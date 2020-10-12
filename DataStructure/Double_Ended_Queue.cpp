/*Author Alok Khulbay
Date:12/10/2020.
*/
#include <iostream>
#include <deque>
#include <string>
#include <cstdlib>
#include <conio.h>
using namespace std;
int main()
{
    deque<int> d;
    deque<int>::iterator it;
    int c, item;
    while (1)
    {
        cout << "1.Size of the Deque" << endl;
        cout << "2.Insert Element at the End" << endl;
        cout << "3.Insert Element at the Front" << endl;
        cout << "4.Delete Element at the End" << endl;
        cout << "5.Delete Element at the Front" << endl;
        cout << "6.Front Element at the Deque" << endl;
        cout << "7.Last Element at the Deque" << endl;
        cout << "8.Display Deque" << endl;
        cout << "9.Exit" << endl;
        cout << "Enter your choice:";
        cin >> c;
        switch (c)
        {
        case 1:
            cout << "Size of the Deque: " << d.size() << endl;
            break;
        case 2:
            cout << "Enter value to be inserted at the End: " << endl;
            cin >> item;
            d.push_back(item);
            break;
        case 3:
            cout << "Enter value to be inserted at the Front: " << endl;
            cin >> item;
            d.push_front(item);
            break;
        case 4:
            item = d.back();
            d.pop_back();
            cout << "Element " << item << " Deleted" << endl;
            break;
        case 5:
            item = d.front();
            d.pop_front();
            cout << "Element " << item << "Deleted" << endl;
            break;
        case 6:
            cout << "Front Element of the Deque is: ";
            cout << d.front() << endl;
            break;
        case 7:
            cout << "Back Element of the Deque is: ";
            cout << d.back() << endl;
            break;
        case 8:
            cout << "Elements of Deque: ";
            for (it = d.begin(); it != d.end(); it++)
            {
                cout << *it << " ";
                cout << endl;
            }
            break;
        case 9:
            exit(1);
            break;

        default:
            cout << "Wrong Choice" << endl;
        }
        cout << "Press any key>>>>>>" << endl;
        getchar();
        getche();
    }
    return 0;
}