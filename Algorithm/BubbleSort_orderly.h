// 冒泡排序（跳过有序的改进版）

void BubbleSort_orderly(vector<int>& v) {
	int temp;
	bool orderly = false;
	for (int i = 0; i < v.size() - 1 && !orderly; ++i) {
		orderly = true;
		for (int j = 0; j < v.size() - 1 - i; ++j) {
			if (v[j] > v[j + 1])
			{
				orderly = false;
				temp = v[j];
				v[j] = v[j + 1];
				v[j + 1] = temp;
			}
		}
	}
}