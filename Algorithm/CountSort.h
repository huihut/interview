/*****************

计数排序：统计小于等于该元素值的元素的个数i，于是该元素就放在目标数组的索引i位（i≥0）。

计数排序基于一个假设，待排序数列的所有数均出现在（0，k）的区间之内，如果k过大则会引起较大的空间复杂度
计数排序并非是一种基于比较的排序方法，它直接统计出键值本应该出现的位置
时间复杂度为O（n），空间复杂度为O（n+k）

*****************/


#include<iostream>
#include<vector>

using namespace std;

void countSort(vector<int>& vec,vector<int>& objVec)
{
	vector<int> range(10,0);    //range的下标即键值
	for(int i=0;i<vec.size();++i)
	{//统计每个键值出现的次数
		range[vec[i]]++;
	}

	for(int i=1;i<vec.size();++i)
	{//后面的键值出现的位置为前面所有键值出现的次数之和
		range[i]+=range[i-1];
	}
	//至此，range中存放的是相应键值应该出现的位置
	int length=vec.size();
	for(int i=length-1;i>=0;--i)        //注意一个小细节，统计时最正序的，这里是逆序
	{//如果存在相同的键值，为了保持稳定性，后出现的应该还是位于后面
		//如果正序，则先出现的会放置到后面，因此不再稳定
		objVec[range[vec[i]]]=vec[i];   //将键值放到目标位置
		range[vec[i]]--;
	}
}

int main()
{
	int a[14]={0,5,7,9,6,3,4,5,2,8,6,9,2,1};
	vector<int> vec(a,a+14);
	vector<int> objVec(14,0);

	countSort(vec,objVec);

	for(int i=0;i<objVec.size();++i)
		cout<<objVec[i]<<"  ";
	cout<<endl;

	return 0;
}