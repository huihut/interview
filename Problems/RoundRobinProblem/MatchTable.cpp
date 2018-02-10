#include <iostream>
#include <math.h>

using namespace std;

// 循环赛日程安排函数声明
void MatchTable(int k, int n, int **table);

int main()
{
	int n = 0, k = 0;

	// 用户界面
	cout << "---------------- 循环赛日程安排问题 ----------------" << endl;
	cout << "请输入k(k>=0)，构成 n=(2^k) 个选手的循环赛" << endl;

	// 输入k值
	cin >> k;

	// 判断输入数据合法性，包括检查输入是否为数字，k值是否大于0
	if (cin.fail() || k < 0)
	{
		cout << "输入k错误！" << endl;
		system("pause");
		return 0;
	}

	// 计算比赛日程表大小
	n = pow(2, k);

	// 分配日程表空间
	int **table = new int *[n + 1];
	for (int i = 0; i <= n; i++)
	{
		table[i] = new int[n + 1];
	}

	// 进行循环赛日程安排，生成日程表
	MatchTable(k, n, table);

	// 显示输出
	cout << "------------------------------------------------" << endl;
	for (int i = 1; i <= n; i++)
	{
		for (int j = 1; j <= n; j++)
		{
			cout << table[i][j] << "\t";
		}
		cout << endl;
	}
	cout << "------------------------------------------------" << endl;

	// 暂停查看结果
	system("pause");

	// 释放内存
	for (int i = 0; i <= n; i++)
		delete[] table[i];
	delete[] table;

	// 指针置空
	table = NULL;

	return 0;
}

// 进行循环赛日程安排，生成日程表
void MatchTable(int k, int n, int **table)
{
	// 设置日程表第一行的值
	for (int i = 1; i <= n; i++)
		table[1][i] = i;

	// 每次填充的起始填充位置
	int begin = 1;

	// 用分治法分separate份，循环求解
	for (int separate = 1; separate <= k; separate++)
	{
		// 日程表进行划分
		n /= 2;

		// flag为每一小份的列的标记
		for (int flag = 1; flag <= n; flag++)
		{
			// 操作行
			for (int i = begin + 1; i <= 2 * begin; i++)
			{
				// 操作列
				for (int j = begin + 1; j <= 2 * begin; j++)
				{
					// 把左上角的值赋给右下角
					table[i][j + (flag - 1) * begin * 2] = table[i - begin][j + (flag - 1) * begin * 2 - begin];
					// 把右上角的值赋给左下角
					table[i][j + (flag - 1) * begin * 2 - begin] = table[i - begin][j + (flag - 1) * begin * 2];
				}
			}
		}
		// 进入日程表的下一个划分进行填充
		begin *= 2;
	}
}
