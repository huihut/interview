// 选择排序
void SelectionSort(vector<int>& v) {
	int min, temp;
	for (int i = 0; i < v.size() - 1; ++i) {
		min = i;
		for (int j = i + 1; j < v.size(); ++j) {
			if (v[j] < v[min]) {    // 标记最小的
				min = j;
			}
		}
		if (i != min) { // 交换到前面
			temp = v[i];
			v[i] = v[min];
			v[min] = temp;
		}
	}
}