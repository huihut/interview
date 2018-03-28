// 冒泡排序（改进版）
void BubbleSort_orderly(vector<int>& v) {
	int len = v.size();
	bool orderly = false;
	for (int i = 0; i < len - 1 && !orderly; ++i) {
		orderly = true;
		for (int j = 0; j < len - 1 - i; ++j) {
			if (v[j] > v[j + 1]) {  // 从小到大
				orderly = false;	// 发生交换则仍非有序
				swap(v[j], v[j + 1]);
			}
		}
	}
}