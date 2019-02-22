/*****************

计数排序：统计小于等于该元素值的元素的个数i，于是该元素就放在目标数组的索引i位（i≥0）。

计数排序基于一个假设，待排序数列的所有数均为整数，且出现在（0，k）的区间之内。
如果 k（待排数组的最大值） 过大则会引起较大的空间复杂度，一般是用来排序 0 到 100 之间的数字的最好的算法，但是它不适合按字母顺序排序人名。
计数排序不是比较排序，排序的速度快于任何比较排序算法。
时间复杂度为 O（n+k），空间复杂度为 O（n+k）

算法的步骤如下：

1. 找出待排序的数组中最大和最小的元素
2. 统计数组中每个值为 i 的元素出现的次数，存入数组 C 的第 i 项
3. 对所有的计数累加（从 C 中的第一个元素开始，每一项和前一项相加）
4. 反向填充目标数组：将每个元素 i 放在新数组的第 C[i] 项，每放一个元素就将 C[i] 减去 1

*****************/


#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// 计数排序
void CountSort(vector<int>& vecRaw, vector<int>& vecObj)
{
	// 确保待排序容器非空
	if (vecRaw.size() == 0)
		return;

	// 使用 vecRaw 的最大值 + 1 作为计数容器 countVec 的大小
	int vecCountLength = (*max_element(begin(vecRaw), end(vecRaw))) + 1;
	vector<int> vecCount(vecCountLength, 0);

	// 统计每个键值出现的次数
	for (int i = 0; i < vecRaw.size(); i++)
		vecCount[vecRaw[i]]++;
	
	// 后面的键值出现的位置为前面所有键值出现的次数之和
	for (int i = 1; i < vecCountLength; i++)
		vecCount[i] += vecCount[i - 1];

	// 将键值放到目标位置
	for (int i = vecRaw.size(); i > 0; i--)	// 此处逆序是为了保持相同键值的稳定性
		vecObj[--vecCount[vecRaw[i - 1]]] = vecRaw[i - 1];
}

int main()
{
	vector<int> vecRaw = { 0,5,7,9,6,3,4,5,2,8,6,9,2,1 };
	vector<int> vecObj(vecRaw.size(), 0);

	CountSort(vecRaw, vecObj);

	for (int i = 0; i < vecObj.size(); ++i)
		cout << vecObj[i] << "  ";
	cout << endl;

	return 0;
}