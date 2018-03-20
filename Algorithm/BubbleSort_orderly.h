// 冒泡排序（改进版）
void BubbleSort_orderly(vector<int>& v) {
	if (v.size() <= 0)
		return;
	int temp;
	bool orderly = false;
	for (int i = 0; i < v.size() - 1 && !orderly; ++i) {
		orderly = true;
		for (int j = 0; j < v.size() - 1 - i; ++j) {
			if (v[j] > v[j + 1]) {  // 从小到大
				orderly = false;	// 发生交换则仍非有序
				temp = v[j];
				v[j] = v[j + 1];
				v[j + 1] = temp;
			}
		}
	}
}