
/**
* @author huihut
* @E-mail:huihut@outlook.com
* @version 创建时间：2016年9月9日
* 说明：本程序实现了一个顺序表。
*/

#include "stdio.h"
#include "stdlib.h"
#include "malloc.h"

//5个常量定义
#define TRUE 1
#define FALSE 0
#define OK 1
#define ERROR 0
#define OVERFLOW -1

//测试程序长度定义
#define LONGTH 5

//类型定义
typedef int Status;
typedef int ElemType;

//顺序栈的类型
typedef struct {
	ElemType *elem;
	int length;
	int size;
	int increment;
} SqList;

//初始化顺序表L
Status InitList_Sq(SqList &L, int size, int inc) {
	L.elem = (ElemType *)malloc(size * sizeof(ElemType));
	if (NULL == L.elem) return OVERFLOW;
	L.length = 0;
	L.size = size;
	L.increment = inc;
	return OK;
}

//销毁顺序表L
Status DestroyList_Sq(SqList &L) {
	free(L.elem);
	L.elem = NULL;
	return OK;
}

//将顺序表L清空
Status ClearList_Sq(SqList &L) {
	if (0 != L.length) L.length = 0;
	return OK;
}

//若顺序表L为空表，则返回TRUE，否则FALSE
Status ListEmpty_Sq(SqList L) {
	if (0 == L.length) return TRUE;
	return FALSE;
}

//返回顺序表L中元素个数
int ListLength_Sq(SqList L) {
	return L.length;
}

// 用e返回顺序表L中第i个元素的值
Status GetElem_Sq(SqList L, int i, ElemType &e) {
	e = L.elem[--i];
	return OK;
}


// 在顺序表L顺序查找元素e，成功时返回该元素在表中第一次出现的位置，否则返回 - 1
int Search_Sq(SqList L, ElemType e) {
	int i = 0;
	while (i < L.length && L.elem[i] != e) i++;
	if (i < L.length) return i;
	else return -1;
}

//遍历调用
Status visit(ElemType e) {
	printf("%d\t", e);
	return OK;
}

//遍历顺序表L，依次对每个元素调用函数visit()
Status ListTraverse_Sq(SqList L, Status(*visit)(ElemType e)) {
	if (0 == L.length) return ERROR;
	for (int i = 0; i < L.length; i++) {
		visit(L.elem[i]);
	}
	return OK;
}

//将顺序表L中第i个元素赋值为e
Status PutElem_Sq(SqList &L, int i, ElemType e) {
	if (i > L.length) return ERROR;
	e = L.elem[--i];
	return OK;

}

//在顺序表L表尾添加元素e
Status Append_Sq(SqList &L, ElemType e) {
	if (L.length >= L.size) return ERROR;
	L.elem[L.length] = e;
	L.length++;
	return OK;
}

//删除顺序表L的表尾元素，并用参数e返回其值
Status DeleteLast_Sq(SqList &L, ElemType &e) {
	if (0 == L.length) return ERROR;
	e = L.elem[L.length - 1];
	L.length--;
	return OK;
}

int main() {
	//定义表L
	SqList L;

	//定义测量值
	int size, increment, i;

	//初始化测试值
	size = LONGTH;
	increment = LONGTH;
	ElemType e, eArray[LONGTH] = { 1, 2, 3, 4, 5 };

	//显示测试值
	printf("---【顺序栈】---\n");
	printf("表L的size为：%d\n表L的increment为：%d\n", size, increment);
	printf("待测试元素为：\n");
	for (i = 0; i < LONGTH; i++) {
		printf("%d\t", eArray[i]);
	}
	printf("\n");

	//初始化顺序表
	if (!InitList_Sq(L, size, increment)) {
		printf("初始化顺序表失败\n");
		exit(0);
	}
	printf("已初始化顺序表\n");

	//判空
	if (TRUE == ListEmpty_Sq(L)) printf("此表为空表\n");
	else printf("此表不是空表\n");

	//入表
	printf("将待测元素入表：\n");
	for (i = 0; i < LONGTH; i++) {
		if (ERROR == Append_Sq(L, eArray[i])) printf("入表失败\n");;
	}
	printf("入表成功\n");

	//遍历顺序表L
	printf("此时表内元素为：\n");
	ListTraverse_Sq(L, visit);

	//出表
	printf("\n将表尾元素入表到e：\n");
	if (ERROR == DeleteLast_Sq(L, e)) printf("出表失败\n");
	printf("出表成功\n出表元素为%d\n", e);

	//遍历顺序表L
	printf("此时表内元素为：\n");
	ListTraverse_Sq(L, visit);

	//销毁顺序表
	printf("\n销毁顺序表\n");
	if (OK == DestroyList_Sq(L)) printf("销毁成功\n");
	else printf("销毁失败\n");

	getchar();
	return 0;
}