#include <iostream>
using namespace std;

int main()
{ int n,sum;
    cout<<"Enter the natural number till you want the sum of natural number:";
    cin>>n;
    //method 1
    sum=(n*(n+1))/2;
    cout<<sum;
    //method2; for this initialize sum=0
    for(int i=1; i<=n; i++)
    {
        sum =sum+i;
    }
cout<<sum;


}