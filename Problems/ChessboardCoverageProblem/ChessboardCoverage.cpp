#include <iostream>
#include <math.h>
#include <cctype>

using namespace std;

int num_Now = 0;			// 记录L型骨牌编号
int **board = NULL;		// 棋盘指针

						// 函数声明
void ChessBoard(int num_BoardTopLeftRow, int num_BoardTopLeftColumn, int num_SpecialRow, int num_SpecialColumn, int boardSize);

int main() {

	int num_BoardTopLeftRow = 0,		// 棋盘左上角的行号
		num_BoardTopLeftColumn = 0,		// 棋盘左上角的列号
		num_SpecialRow = 0,						// 特殊方格所在的行号
		num_SpecialColumn = 0,				// 特殊方格所在的列号
		boardSize = 0,								// 棋盘大小
		k = 0;												// 构成的(2^k)*(2^k)个方格的棋盘

															// 用户界面
	cout << "---------------- 棋盘覆盖问题 ----------------" << endl;
	cout << "请输入k(k>=0)，构成(2^k)*(2^k)个方格的棋盘" << endl;

	// 输入k值
	cin >> k;

	// 判断输入数据合法性，包括检查输入是否为数字，k值是否大于0
	if (cin.fail() || k < 0)
	{
		cout << "输入k错误！" << endl;
		system("pause");
		return 0;
	}

	// 计算棋盘大小
	boardSize = pow(2, k);

	cout << "请输入特殊方格所在的行号和列号（从0开始，用空格隔开）" << endl;

	// 输入特殊方格所在的行号和列号
	cin >> num_SpecialRow >> num_SpecialColumn;

	// 判断输入数据合法性，包括检查输入是否为数字，特殊方格行号列号是否大于0，特殊方格行号列号是否不大于棋盘大小
	if (cin.fail() || num_SpecialRow < 0 || num_SpecialColumn < 0 || num_SpecialRow >= boardSize || num_SpecialColumn >= boardSize)
	{
		cout << "输入行号或列号错误！" << endl;
		system("pause");
		return 0;
	}

	// 分配棋盘空间
	board = new int *[boardSize];
	for (auto i = 0; i < boardSize; i++)
	{
		board[i] = new int[boardSize];
	}

	// 为特殊方格赋初值0
	board[num_SpecialRow][num_SpecialColumn] = 0;

	//执行棋盘覆盖函数
	ChessBoard(num_BoardTopLeftRow, num_BoardTopLeftColumn, num_SpecialRow, num_SpecialColumn, boardSize);

	// 显示输出
	cout << "------------------------------------------------" << endl;
	for (auto i = 0; i < boardSize; i++)
	{
		for (auto j = 0; j < boardSize; j++)
		{
			cout << board[i][j] << "\t";
		}
		cout << endl;
	}
	cout << "------------------------------------------------" << endl;

	// 暂停查看结果
	system("pause");

	// 释放内存
	for (int i = 0; i <= boardSize; i++)
		delete[] board[i];
	delete[] board;

	// 指针置空
	board = NULL;

	return 0;
}

// 棋盘覆盖函数
void ChessBoard(int num_BoardTopLeftRow, int num_BoardTopLeftColumn, int num_SpecialRow, int num_SpecialColumn, int boardSize)
{
	// 棋盘大小为1则直接返回
	if (boardSize == 1) return;

	int num = ++num_Now,			// L型骨牌编号
		size = boardSize / 2;		// 分割棋盘，行列各一分为二

									// 覆盖左上角子棋盘
	if (num_SpecialRow < num_BoardTopLeftRow + size && num_SpecialColumn < num_BoardTopLeftColumn + size)
	{
		// 递归覆盖含有特殊方格的子棋盘
		ChessBoard(num_BoardTopLeftRow, num_BoardTopLeftColumn, num_SpecialRow, num_SpecialColumn, size);
	}
	else
	{
		// 用编号为num的L型骨牌覆盖右下角
		board[num_BoardTopLeftRow + size - 1][num_BoardTopLeftColumn + size - 1] = num;

		// 递归覆盖其余棋盘
		ChessBoard(num_BoardTopLeftRow, num_BoardTopLeftColumn, num_BoardTopLeftRow + size - 1, num_BoardTopLeftColumn + size - 1, size);
	}

	// 覆盖右上角子棋盘
	if (num_SpecialRow < num_BoardTopLeftRow + size && num_SpecialColumn >= num_BoardTopLeftColumn + size)
	{
		// 递归覆盖含有特殊方格的子棋盘
		ChessBoard(num_BoardTopLeftRow, num_BoardTopLeftColumn + size, num_SpecialRow, num_SpecialColumn, size);
	}
	else
	{
		// 用编号为num的L型骨牌覆盖左下角
		board[num_BoardTopLeftRow + size - 1][num_BoardTopLeftColumn + size] = num;

		// 递归覆盖其余棋盘
		ChessBoard(num_BoardTopLeftRow, num_BoardTopLeftColumn + size, num_BoardTopLeftRow + size - 1, num_BoardTopLeftColumn + size, size);
	}

	// 覆盖左下角子棋盘
	if (num_SpecialRow >= num_BoardTopLeftRow + size && num_SpecialColumn < num_BoardTopLeftColumn + size)
	{
		// 递归覆盖含有特殊方格的子棋盘
		ChessBoard(num_BoardTopLeftRow + size, num_BoardTopLeftColumn, num_SpecialRow, num_SpecialColumn, size);
	}
	else
	{
		// 用编号为num的L型骨牌覆盖右上角
		board[num_BoardTopLeftRow + size][num_BoardTopLeftColumn + size - 1] = num;

		// 递归覆盖其余棋盘
		ChessBoard(num_BoardTopLeftRow + size, num_BoardTopLeftColumn, num_BoardTopLeftRow + size, num_BoardTopLeftColumn + size - 1, size);
	}

	// 覆盖右下角子棋盘
	if (num_SpecialRow >= num_BoardTopLeftRow + size && num_SpecialColumn >= num_BoardTopLeftColumn + size)
	{
		// 递归覆盖含有特殊方格的子棋盘
		ChessBoard(num_BoardTopLeftRow + size, num_BoardTopLeftColumn + size, num_SpecialRow, num_SpecialColumn, size);
	}
	else
	{
		// 用编号为num的L型骨牌覆盖左上角
		board[num_BoardTopLeftRow + size][num_BoardTopLeftColumn + size] = num;

		// 递归覆盖其余棋盘
		ChessBoard(num_BoardTopLeftRow + size, num_BoardTopLeftColumn + size, num_BoardTopLeftRow + size, num_BoardTopLeftColumn + size, size);
	}
}
