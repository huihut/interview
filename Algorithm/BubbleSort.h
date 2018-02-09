// 冒泡排序

void BubbleSort(vector<int>& v) {
	int temp;
	for (int i = 0; i < v.size() - 1; ++i) {
		for (int j = 0; j < v.size() - 1 - i; ++j) {
			if (v[j] > v[j + 1]) {  // 从小到大
				temp = v[j];
				v[j] = v[j + 1];
				v[j + 1] = temp;
			}
		}
	}
}