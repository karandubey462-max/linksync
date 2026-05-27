#include <iostream>
using namespace std;
 int main()
 {
    int n,sum;
    cout<<"Enter the number n:";
    cin>>n;
    sum=0;
    int i=1;
    do{
        i++;
        sum=sum+i;
        

    }while(i<=n);
    cout<<sum;
 }