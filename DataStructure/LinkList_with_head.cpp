/**
* @author huihut
* @E-mail:huihut@outlook.com
* @version 创建时间：2016年9月23日
* 说明：本程序实现了一个具有头结点的单链表。
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

//类型定义
typedef int Status;
typedef int ElemType;

//测试程序长度定义
#define LONGTH 5

//链表的类型
typedef struct LNode {
	ElemType data;
	struct LNode *next;
} LNode, *LinkList;

//创建包含n个元素的链表L，元素值存储在data数组中
Status create(LinkList &L, ElemType *data, int n) {
	LNode *p, *q;
	int i;
	if (n < 0) return ERROR;
	p = L = NULL;

	q = (LNode *)malloc(sizeof(LNode));
	if (NULL == q) return OVERFLOW;
	q->next = NULL;
	p = L = q;

	for (i = 0; i < n; i++)
	{
		q = (LNode *)malloc(sizeof(LNode));
		if (NULL == q) return OVERFLOW;
		q->data = data[i];
		q->next = NULL;
		p->next = q;
		p = q;
	}
	return OK;
}

//e从链表末尾入链表
Status EnQueue_LQ(LinkList &L, ElemType &e) {
	LinkList p, q;

	if (NULL == (q = (LNode *)malloc(sizeof(LNode)))) return OVERFLOW;
	q->data = e;
	q->next = NULL;
	if (NULL == L)
	{
		L = (LNode *)malloc(sizeof(LNode));
		if (NULL == L) return OVERFLOW;
		L->next = q;
	}
	else if (NULL == L->next)
	{
		L->next = q;
	}
	else
	{
		p = L;
		while (p->next != NULL)
		{
			p = p->next;
		}
		p->next = q;
	}
	return OK;
}


//从链表头节点出链表到e
Status DeQueue_LQ(LinkList &L, ElemType &e) {
	if (NULL == L || NULL == L->next) return ERROR;
	LinkList p;
	p = L->next;
	e = p->data;
	L->next = p->next;
	free(p);
	return OK;
}

//遍历调用
Status visit(ElemType e) {
	printf("%d\t", e);
	return OK;
}

//遍历单链表
void ListTraverse_L(LinkList L, Status(*visit)(ElemType e))
{
	if (NULL == L || NULL == L->next) return;
	for (LinkList p = L->next; NULL != p; p = p->next) {
		visit(p->data);
	}
}

int main() {
	int i;
	ElemType e, data[LONGTH] = { 1, 2, 3, 4, 5 };
	LinkList L;

	//显示测试值
	printf("---【有头结点的单链表】---\n");
	printf("待测试元素为：\n");
	for (i = 0; i < LONGTH; i++) printf("%d\t", data[i]);
	printf("\n");

	//创建链表L
	printf("创建链表L\n");
	if (ERROR == create(L, data, LONGTH))
	{
		printf("创建链表L失败\n");
		return -1;
	}
	printf("成功创建包含1个头结点、%d个元素的链表L\n元素值存储在data数组中\n", LONGTH);

	//遍历单链表
	printf("此时链表中元素为：\n");
	ListTraverse_L(L, visit);

	//从链表头节点出链表到e
	printf("\n出链表到e\n");
	DeQueue_LQ(L, e);
	printf("出链表的元素为：%d\n", e);
	printf("此时链表中元素为：\n");

	//遍历单链表
	ListTraverse_L(L, visit);

	//e从链表末尾入链表
	printf("\ne入链表\n");
	EnQueue_LQ(L, e);
	printf("入链表的元素为：%d\n", e);
	printf("此时链表中元素为：\n");

	//遍历单链表
	ListTraverse_L(L, visit);
	printf("\n");

	getchar();
	return 0;
}