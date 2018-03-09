// 顺序查找
int SequentialSearch(vector<int>& v, int k) {
	for (int i = 0; i < v.size(); ++i)
		if (v[i] == k)
			return i;
	return -1;
}