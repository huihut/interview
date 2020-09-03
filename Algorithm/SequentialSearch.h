// 顺序查找
int SequentialSearch(vector<int>& v, int k) {
	for (int i = 0; i < v.size(); ++i)
		if (v[i] == k)
			return i;
	return -1;
}


/* The following is a Sentinel Search Algorithm which only performs 
    just one test in each loop iteration thereby reducing time complexity */

int BetterSequentialSearch(vector<int>& v, int k) {
    int last = v[v.size()-1];
    v[v.size()-1] = k;
    int i = 0;
	while (v[i]!= k)
        	i++;
    v[v.size()-1] = last;
    if(i < v.size()-1 || v[v.size()-1] == k)
        return i;
    return -1;
}