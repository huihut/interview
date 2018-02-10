#include <iostream>
#include <fstream>
#include <vector>
#include <string>

using namespace std;

#define OK 0
#define ERROR -1
#define INPUTNAME "input.txt"

// 查找
int search(vector<string>& v_data, string keyword) {
	int i = 0;

	// 遍历每个元素直到找到关键字
	for (; i < v_data.size(); i++) {

		// 比较关键字与每个词是否相等
		if (0 == v_data[i].compare(keyword)){

			// 相等则返回关键字的位序
			return i;
		}
	}
	return ERROR;
}


// 文件读取
int FileRead(vector<string>& v_data) {

	ifstream f_in(INPUTNAME);

	//判断读取失败
	if (!f_in) {
		cout << "文件读取失败！" << endl;
		system("pause");
		return ERROR;
	}

	string word;

	// 文件逐个读取
	while (!f_in.eof()) {
		f_in >> word;
		v_data.push_back(word);
	}

	// 关闭文件
	f_in.close();

	return OK;
}

// 界面
void Interface(string& keyword) {
	cout << "-------------------- 文件查找 --------------------" << endl;
	cout << "【说明】：本程序实现对文件内容的查找" << endl;
	cout << "即从input.txt读入，查找关键字的首次出现位置" << endl;
	cout << "--------------------------------------------------" << endl;
	cout << "请输入关键字：" << endl;
	cout << "--------------------------------------------------" << endl;
	cin >> keyword;
	cout << "--------------------------------------------------" << endl;
}

int main() {

	vector<string> v_data;

	// 文件读取
	if (ERROR == FileRead(v_data))
		return ERROR;

	int index = -1;
	string keyword;

	// 界面
	Interface(keyword);

	// 合法性检测
	if (keyword.empty()) {
		cout << "请输入合法的关键字！" << endl;
		system("pause");
		return ERROR;
	}

	// 查找
	index = search(v_data, keyword);

	//未找到输出
	if (ERROR == index) {
		cout << "未找到此关键字！" << endl;
		system("pause");
		return ERROR;
	}

	//输出找到的关键字索引
	cout << "此关键字位于第 " << index + 1 << " 个词的位置！" << endl;

	system("pause");

	return OK;
}
