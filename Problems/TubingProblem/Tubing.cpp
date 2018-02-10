#include <iostream>
using namespace std;

// 油井y坐标指针
float * y = NULL;

// 快速排序
void quick_sort(int low, int high)
{
	if (low >= high)		// 结束标志
		return;
	int first = low;		// 低位下标
	int last = high;		// 高位下标
	float key = y[first];	// 设第一个为基准

	while (first < last)
	{
		// 将比第一个小的移到前面
		while (first < last && y[last] >= key)
			last--;
		if (first < last)
			y[first++] = y[last];

		// 将比第一个大的移到后面
		while (first < last && y[first] <= key)
			first++;
		if (first < last)
			y[last--] = y[first];
	}
	// 基准置位
	y[first] = key;
	// 前半递归
	quick_sort(low, first - 1);
	// 后半递归
	quick_sort(first + 1, high);
}

int main()
{
	int n;					// 油井数
	float mid;				// y数组的中间位置的数
	float minDistance = 0;	// 各油井到主管道之间的管道长度总和最小位置

	cout << "---------------- 输油管问题 ----------------" << endl;
	cout << "请输入油井数 n (n>=0) " << endl;

	// 输入油井数
	cin >> n;

	// 判断输入数据合法性，包括检查输入是否为数字，k值是否大于0
	if (cin.fail() || n < 0)
	{
		cout << "输入n错误！" << endl;
		system("pause");
		return 0;
	}

	// 分配n个y坐标存储空间
	y = new float[n];

	cout << "请输入 " << n << " 个油井的 y 坐标（用空格隔开）" << endl;

	// 输入油井的 y 坐标
	for (auto i = 0; i < n; i++)
	{
		cin >> y[i];
	}

	// 判断输入数据合法性
	if (cin.fail())
	{
		cout << "输入y坐标错误！" << endl;
		system("pause");
		return 0;
	}

	// 运用快速排序对y坐标数组进行排序
	quick_sort(0, n - 1);

	// 计算y数组的中间位置的数
	mid = y[n / 2];

	// 计算各个油井到主输油管的长度之和
	for (auto i = 0; i < n; i++)
	{
		minDistance += abs(y[i] - mid);
	}

	// 显示输出
	cout << "------------------------------------------------" << endl;
	// 判断油井奇偶，做不同的输出
	if (n & 1)
	{
		// n为奇数，则最优位置为y数组的第n/2个油井的y坐标
		cout << "主管道的最优位置为：y = " << mid << endl;
	}
	else
	{
		// n为偶数，则最优位置为y数组的中间两个油井的y坐标的区间
		cout << "主管道的最优位置为：y = [" << y[n / 2 - 1] << "," << mid << "]" << endl;
	}
	// 输出各油井到主管道之间的管道总长度
	cout << "各油井到主管道之间的管道总长度为：" << minDistance << endl;
	cout << "------------------------------------------------" << endl;

	// 暂停查看结果
	system("pause");

	// 释放内存
	delete[] y;

	// 指针置空
	y = NULL;

	return 0;
}
