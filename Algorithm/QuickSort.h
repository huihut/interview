// 快速排序
void QuickSort(vector<int>& v, int low, int high) {
	if (low >= high)		// 结束标志
		return;
	int first = low;		// 低位下标
	int last = high;		// 高位下标
	int key = v[first];		// 设第一个为基准

	while (first < last)
	{
		// 将比第一个小的移到前面
		while (first < last && v[last] >= key)
			last--;
		if (first < last)
			v[first++] = v[last];

		// 将比第一个大的移到后面
		while (first < last && v[first] <= key)
			first++;
		if (first < last)
			v[last--] = v[first];
	}
	// 基准置位
	v[first] = key;
	// 前半递归
	QuickSort(v, low, first - 1);
	// 后半递归
	QuickSort(v, first + 1, high);
}