#include <stdio.h>

//通项法
int Neumann2_3_12(int n) {

	//通项公式的求解请查看说明文档
	return 2 * n*n + 2 * n + 1;
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

	//用通项公式求解
	a = Neumann2_3_12(n);

	printf("------------通项法-------------\n");
	printf(" %d 阶冯诺依曼邻居的元胞数为 %d\n", n, a);

	getchar();
	getchar();
	return 0;
}
