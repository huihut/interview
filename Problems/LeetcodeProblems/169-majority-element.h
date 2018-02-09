#include <map>
class Solution {
public:
	int majorityElement(vector<int>& nums) {
		int n = nums.size();
		map<int, int> m_times;
		int moreThanTimes = n / 2;
		for (auto i = 0; i < n; ++i) {
			auto it = m_times.find(nums[i]);
			if (it == m_times.end()) {
				// No existence in map, insert
				m_times.insert(std::pair<int, int>(nums[i], 1));
				it = m_times.find(nums[i]);
			}
			// Is it more than ⌊ n/2 ⌋ times ?
			if ((*it).second > moreThanTimes) {
				return (*it).first;
			}
			else {
				(*it).second++;
			}
		}
		// Can't find
		return -1;
	}
};