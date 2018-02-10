#include <stdio.h>

//递归法
int Neumann2_4_12(int n) {

	//由图可知第0次有1个方格
	if (n == 0) return 1;

	//递推关系的求解请查看说明文档
	return Neumann2_4_12(n - 1) + 4 * n;
}

int main() {
	int n = 0, a = 0;

	printf("------冯诺依曼邻居问题------\n");
	printf("已知：\n");
	printf(" 0 阶冯诺依曼邻居的元胞数为 1 \n");
	printf(" 1 阶冯诺依曼邻居的元胞数为 5 \n");
	printf(" 2 阶冯诺依曼邻居的元胞数为 13 \n");
	printf("求：\n");
	printf(" n 阶冯诺依曼邻居的元胞数\n");
	printf("----------------------------\n");
	printf("请输入n\n");
	scanf("%d", &n);

	//建立递推关系，使用递归求解
	a = Neumann2_4_12(n);

	printf("------------通项法-------------\n");
	printf(" %d 阶冯诺依曼邻居的元胞数为 %d\3n", n, a);

	getchar();
	getchar();
	return 0;
}
