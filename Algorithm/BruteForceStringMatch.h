// 蛮力字符串匹配
int BruteForceStringMatch(vector<char>& Total, vector<char>& Part)
{
	int i, j;
	for (i = 0; i < Total.size() - Part.size(); ++i) {
		j = 0;
		while (j < Part.size() && Part[j] == Total[i + j]) {
			++j;
			if (j == Part.size()) 
				return i;
		}
	}
	return -1;
}