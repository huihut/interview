#include <iostream>
#include <fstream>
#include <vector>

using namespace std;

#define OK 0
#define ERROR -1
#define INPUTNAME "input.txt"
#define OUTPUTNAME "output.txt"

// 选择排序
int SelectSort(vector<int>& v_data, int b_mode) {

	size_t i_num = v_data.size(), temp = 0;

	// 从小到大排
	if (0 == b_mode) {
		size_t min;
		for (size_t i = 0; i < i_num - 1; i++) {
			min = i;
			for (size_t j = i + 1; j < i_num; j++)
				if (v_data[min] > v_data[j])
					min = j;
			if (min != i) {
				temp = v_data[min];
				v_data[min] = v_data[i];
				v_data[i] = temp;
			}
		}
	}

	// 从大到小排
	else {
		size_t max;
		for (size_t i = 0; i < i_num - 1; i++) {
			max = i;
			for (size_t j = i + 1; j < i_num; j++)
				if (v_data[max] < v_data[j])
					max = j;
			if (max != i) {
				temp = v_data[max];
				v_data[max] = v_data[i];
				v_data[i] = temp;
			}
		}
	}

	return OK;
}

// 冒泡排序
int BubbleSort(vector<int>& v_data, int b_mode) {

	size_t num = v_data.size(), temp = 0;

	// 从小到大排
	if (0 == b_mode) {
		for (size_t i = 0; i < num - 1; i++) {
			for (size_t j = 0; j < num - i - 1; j++) {
				if (v_data[j] > v_data[j + 1]) {
					temp = v_data[j];
					v_data[j] = v_data[j + 1];
					v_data[j + 1] = temp;
				}
			}
		}
	}

	// 从大到小排
	else {
		for (size_t i = 0; i < num - 1; i++) {
			for (size_t j = 0; j < num - i - 1; j++) {
				if (v_data[j] < v_data[j + 1]) {
					temp = v_data[j];
					v_data[j] = v_data[j + 1];
					v_data[j + 1] = temp;
				}
			}
		}
	}

	return OK;
}

// 文件读取
int FileRead(vector<int>& v_data) {

	ifstream f_in(INPUTNAME);

	//判断读取失败
	if (!f_in) {
		cout << "文件读取失败！" << endl;
		system("pause");
		return ERROR;
	}

	int i_temp;

	// 文件逐个读取
	while (!f_in.eof()) {
		f_in >> i_temp;
		v_data.push_back(i_temp);
	}

	// 关闭文件
	f_in.close();

	return OK;
}

// 文件写入
int FileWrite(vector<int>& v_data) {

	ofstream f_out(OUTPUTNAME);

	// 判断读取失败
	if (!f_out) {
		cout << "文件写入失败！" << endl;
		return ERROR;
	}

	// 文件逐个写入
	for (int i = 0; i < v_data.size(); i++)
		f_out << v_data[i] << " ";

	f_out.close();
	return OK;
}

// 界面
void Interface(int& i_algorithm, int& i_mode) {
	cout << "-------------------- 文件排序 --------------------" << endl;
	cout << "【说明】：本程序实现对文件内容的排序" << endl;
	cout << "即从input.txt读入，排序后写入到output.txt" << endl;
	cout << "--------------------------------------------------" << endl;
	cout << "请选择排序算法：" << endl;
	cout << "【0】选择排序" << endl;
	cout << "【1】冒泡排序" << endl;
	cout << "--------------------------------------------------" << endl;
	cin >> i_algorithm;
	cout << "--------------------------------------------------" << endl;
	cout << "请选择排序方式：" << endl;
	cout << "【0】从小到大" << endl;
	cout << "【1】从大到小" << endl;
	cout << "--------------------------------------------------" << endl;
	cin >> i_mode;
	cout << "--------------------------------------------------" << endl;
}

int main() {

	vector<int> v_data;

	// 文件读取
	if (ERROR == FileRead(v_data))
		return ERROR;

	int i_algorithm, i_mode;

	// 界面
	Interface(i_algorithm, i_mode);

	// 排序算法选择检测
	if (0 != i_algorithm && 1 != i_algorithm) {
		cout << "排序算法选择错误！" << endl;
		system("pause");
		return ERROR;
	}

	// 排序方式选择检测
	if (0 != i_mode && 1 != i_mode) {
		cout << "排序方式选择错误！" << endl;
		system("pause");
		return ERROR;
	}

	// 排序
	if (i_algorithm)
		BubbleSort(v_data, i_mode);
	else
		SelectSort(v_data, i_mode);

	// 文件写入
	if (ERROR == FileWrite(v_data))
		return ERROR;

	cout << "排序完成，数据已写入：" << OUTPUTNAME << endl;
	cout << "--------------------------------------------------" << endl;

	system("pause");

	return OK;
}
