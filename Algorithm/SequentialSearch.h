// 顺序查找
int SequentialSearch(vector<int>& v, int k) {
	int i = 0;
	for (; i < v.size(); ++i)
		if (v[i] == k) 
			return i;
	if (i == v.size()) 
		return -1;
}